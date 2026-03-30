import { randomUUID } from 'crypto'
import {
  APP_LOGIN_URL,
  APP_TOKEN_EXCHANGE_URL,
  SEND_VERIFICATION_CODE_URL,
  VERIFY_ACTION_TICKET_URL,
} from '../../routes'
import { encryptCredentials, generateAppLoginDS } from './auth.helper'
import {
  IActionTicket,
  IAuthLoginResult,
  ILoginAigisData,
  ILoginByPasswordOptions,
} from './auth.interface'

/**
 * Authentication module used to retrieve special tokens (stoken_v2)
 * via App Login mechanisms.
 *
 * @class
 * @category Main
 */
export class AuthClient {
  /**
   * Login to HoyoVerse by account/password securely to fetch stoken_v2.
   *
   * @async
   * @param {ILoginByPasswordOptions} options - Contains account, password and optional aigis headers
   * @returns {Promise<IAuthLoginResult>} The object dictating the authentication progress
   */
  public async loginByPassword(
    options: ILoginByPasswordOptions,
  ): Promise<IAuthLoginResult> {
    const payload = {
      account: encryptCredentials(options.account),
      password: encryptCredentials(options.password),
    }

    const deviceId = options.deviceId ?? randomUUID().replace(/-/g, '')

    const headers: Record<string, string> = {
      'x-rpc-app_id': 'c9oqaq3s3gu8',
      'x-rpc-client_type': '2', // Indicates Mobile App
      'x-rpc-aigis_v4': 'true',
      'x-rpc-app_version': '4.8.0',
      'x-rpc-sdk_version': '2.2.0',
      'x-rpc-device_id': deviceId,
      ds: generateAppLoginDS(payload),
      'Content-Type': 'application/json',
    }

    if (options.aigisHeaderObject) {
      headers['x-rpc-aigis'] = options.aigisHeaderObject
    }

    // We use the native fetch API to avoid default HTTPRequest headers interference
    try {
      const response = await fetch(APP_LOGIN_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      })

      const responseText = await response.text()
      let responseData: any
      try {
        responseData = JSON.parse(responseText)
      } catch (e: any) {
        throw new Error(`Failed to parse API response as JSON: ${e.message}`)
      }
      const retcode = responseData.retcode

      // Geetest Required Trigger
      if (retcode === -3101) {
        const rawAigis = response.headers.get('x-rpc-aigis')
        let aigisData = undefined

        if (rawAigis) {
          try {
            if (rawAigis.trimStart().startsWith('{')) {
              // New format: direct JSON string
              aigisData = JSON.parse(rawAigis)
            } else {
              // Old format: mmt_type;base64encodedJson
              const split = rawAigis.split(';')
              if (split.length > 1) {
                const decoded = Buffer.from(split[1], 'base64').toString('utf8')
                aigisData = JSON.parse(decoded)
              }
            }
          } catch (e: any) {
            // Ignore parse errors for aigis header
          }
        }
        // 新增 set-cookie header 作為 temp_cookie
        const tempCookie = response.headers.get('set-cookie') || undefined
        console.log('[Geetest Debug] set-cookie:', tempCookie)

        // Parse aigis_data: data field may be a JSON-encoded string
        let parsedAigisData: ILoginAigisData | undefined = undefined
        if (aigisData) {
          const inner =
            typeof aigisData.data === 'string'
              ? (() => {
                  try {
                    return JSON.parse(aigisData.data)
                  } catch {
                    return {}
                  }
                })()
              : aigisData.data ?? {}
          parsedAigisData = {
            ...inner,
            session_id: aigisData.session_id,
            mmt_type: aigisData.mmt_type,
          }
        }

        return {
          status: 'require_geetest',
          retcode,
          aigis_header: rawAigis || undefined,
          aigis_data: parsedAigisData,
          temp_cookie: tempCookie,
          deviceId,
          message: 'Geetest Captcha is required to proceed with login.',
        }
      }

      // Successful Auth Token Extraction
      if (retcode === 0 && responseData.data) {
        const data = responseData.data
        const tokenData = data.token ? data.token.token : null
        const uid = data.user_info ? data.user_info.aid : null
        const mid = data.user_info ? data.user_info.mid : null

        if (!tokenData || !uid || !mid) {
          return {
            status: 'error',
            retcode,
            message: 'Failed to extract vital token info from response',
          }
        }

        // Auto exchange for ltoken and cookie_token
        const exchanged = await this.exchangeTokens(tokenData, mid)
        const ltokenV2 = exchanged?.ltokenV2 || ''
        const cookieTokenV2 = exchanged?.cookieTokenV2 || ''

        const cookieString = `stoken_v2=${tokenData}; mid=${mid}; ltuid_v2=${uid}; account_id_v2=${uid}; account_mid_v2=${mid}; ltoken_v2=${ltokenV2}; cookie_token_v2=${cookieTokenV2};`

        return {
          status: 'success',
          retcode,
          stokenV2: tokenData,
          ltokenV2,
          cookieTokenV2,
          cookies: cookieString,
        }
      }

      // Email verification required (new device)
      if (retcode === -3239) {
        const rawVerify = response.headers.get('x-rpc-verify')
        console.log('[Auth Debug] x-rpc-verify raw:', rawVerify)
        let actionTicket: IActionTicket | undefined = undefined
        if (rawVerify) {
          try {
            const outer = JSON.parse(rawVerify)
            // verify_str is a JSON-encoded string containing the actual ticket object
            const verifyStr =
              typeof outer.verify_str === 'string'
                ? JSON.parse(outer.verify_str)
                : outer.verify_str
            actionTicket = { ...verifyStr, risk_ticket: outer.risk_ticket }
          } catch (e) {
            console.log('[Auth Debug] x-rpc-verify parse error:', e)
            actionTicket = { raw: rawVerify }
          }
        }
        console.log('[Auth Debug] actionTicket:', JSON.stringify(actionTicket))
        return {
          status: 'require_email_verify',
          retcode,
          deviceId,
          action_ticket: actionTicket,
          message: responseData.message || 'Email verification required.',
        }
      }

      if (retcode === -3006) {
        return {
          status: 'rate_limited',
          retcode,
          message:
            responseData.message ||
            'Too many requests. Please try again later.',
        }
      }

      console.log(
        '[Auth Debug] Login failed. retcode:',
        retcode,
        'message:',
        responseData.message,
        'data:',
        JSON.stringify(responseData.data),
      )
      return {
        status: 'error',
        retcode,
        message:
          responseData.message || 'Unknown or unsupported retcode encountered.',
      }
    } catch (e: any) {
      // Typically an internal networking error or an unhandled exception
      return {
        status: 'error',
        message:
          e?.message ||
          'A network or system error occurred during authentication.',
      }
    }
  }

  /**
   * Send email verification code for a new device login.
   */
  public async sendVerificationCode(
    actionTicket: IActionTicket,
    deviceId: string,
  ): Promise<{ status: 'sent' | 'error' | 'rate_limited'; message?: string }> {
    const headers: Record<string, string> = {
      'x-rpc-app_id': 'c9oqaq3s3gu8',
      'x-rpc-client_type': '2',
      'x-rpc-app_version': '4.8.0',
      'x-rpc-sdk_version': '2.2.0',
      'x-rpc-device_id': deviceId,
      'Content-Type': 'application/json',
    }
    const payload = {
      action_type: 'verify_for_component',
      action_ticket: actionTicket.ticket ?? actionTicket.raw ?? actionTicket,
    }
    headers['ds'] = generateAppLoginDS(payload)
    console.log(
      '[Auth Debug] sendVerificationCode payload:',
      JSON.stringify(payload),
    )
    try {
      const response = await fetch(SEND_VERIFICATION_CODE_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      })
      const text = await response.text()
      console.log('[Auth Debug] sendVerificationCode response text:', text)
      try {
        const data = JSON.parse(text)
        if (data.retcode === 0) return { status: 'sent' }
        if (data.retcode === -3006)
          return { status: 'rate_limited', message: data.message }
        if (data.retcode !== undefined)
          return { status: 'error', message: data.message }
      } catch {
        // Response is not JSON; fall through to HTTP status check
      }
      if (response.ok) return { status: 'sent' }
      return { status: 'error', message: `HTTP ${response.status}` }
    } catch (e: any) {
      return { status: 'error', message: e?.message }
    }
  }

  /**
   * Verify email code to complete new device login.
   */
  public async verifyActionTicket(
    actionTicket: IActionTicket,
    code: string,
    deviceId: string,
  ): Promise<{ status: 'success' | 'error'; message?: string }> {
    const headers: Record<string, string> = {
      'x-rpc-app_id': 'c9oqaq3s3gu8',
      'x-rpc-client_type': '2',
      'x-rpc-app_version': '4.8.0',
      'x-rpc-sdk_version': '2.2.0',
      'x-rpc-device_id': deviceId,
      'Content-Type': 'application/json',
    }
    const payload = {
      action_type: 'verify_for_component',
      action_ticket: actionTicket.ticket ?? actionTicket,
      email_captcha: code,
      verify_method: 2,
    }
    headers['ds'] = generateAppLoginDS(payload)
    try {
      const response = await fetch(VERIFY_ACTION_TICKET_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (data.retcode === 0) return { status: 'success' }
      return { status: 'error', message: data.message }
    } catch (e: any) {
      return { status: 'error', message: e?.message }
    }
  }

  /**
   * Exchange stoken_v2 to ltoken_v2 and cookie_token_v2.
   *
   * @async
   * @param {string} stokenV2 - The stoken_v2 value.
   * @param {string} mid - The mid value.
   * @returns {Promise<{ ltokenV2: string, cookieTokenV2: string } | null>}
   */
  private async exchangeTokens(
    stokenV2: string,
    mid: string,
  ): Promise<{ ltokenV2: string; cookieTokenV2: string } | null> {
    const payload = {
      dst_token_types: [2, 4],
    }

    const headers: Record<string, string> = {
      'x-rpc-app_id': 'c9oqaq3s3gu8',
      'x-rpc-client_type': '2',
      'x-rpc-app_version': '4.8.0',
      'x-rpc-sdk_version': '2.2.0',
      'x-rpc-device_id': randomUUID().replace(/-/g, ''),
      ds: generateAppLoginDS(payload),
      'Content-Type': 'application/json',
      Cookie: `stoken_v2=${stokenV2}; mid=${mid};`,
    }

    try {
      const response = await fetch(APP_TOKEN_EXCHANGE_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      })

      const responseData = await response.json()
      if (
        responseData.retcode === 0 &&
        responseData.data &&
        responseData.data.list
      ) {
        const list = responseData.data.list as any[]
        let ltokenV2 = ''
        let cookieTokenV2 = ''

        for (const item of list) {
          if (item.token_type === 2) {
            ltokenV2 = item.token
          } else if (item.token_type === 4) {
            cookieTokenV2 = item.token
          }
        }

        return { ltokenV2, cookieTokenV2 }
      }
    } catch (e) {
      // Ignore conversion error
    }

    return null
  }
}

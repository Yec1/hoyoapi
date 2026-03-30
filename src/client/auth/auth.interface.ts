export interface ILoginByPasswordOptions {
  /**
   * The HoyoVerse account (usually the email or phone number).
   */
  account: string
  /**
   * The raw password string.
   */
  password: string
  /**
   * Optional Aigis Header string parsed from geetest verification process.
   */
  aigisHeaderObject?: string | undefined
  /**
   * Optional device ID to use. If omitted, a new UUID is generated.
   * Pass the value returned from a prior require_geetest result to maintain consistency.
   */
  deviceId?: string
}

export interface ILoginAigisData {
  /**
   * The geetest challenge token
   */
  challenge: string
  /**
   * The gt script identifier
   */
  gt: string
  /**
   * Use V4 or not
   */
  use_v4?: boolean
  [key: string]: any
}

export interface IActionTicket {
  /** Raw ticket string from x-rpc-verify header */
  [key: string]: any
}

export interface IAuthLoginResult {
  /**
   * The status of the login action
   */
  status:
    | 'success'
    | 'require_geetest'
    | 'require_email_verify'
    | 'rate_limited'
    | 'error'
  /**
   * Error message if status is error
   */
  message?: string
  /**
   * Retcode from API
   */
  retcode?: number
  /**
   * Aigis Header returned from HoyoVerse when Geetest is required.
   */
  aigis_header?: string | null
  /**
   * Formatted Aigis Data containing geetest challenge details, present when aigis_header exists.
   */
  aigis_data?: ILoginAigisData
  /**
   * Formatted Cookies including stoken_v2 to be used with the APIs
   */
  cookies?: string
  /**
   * The raw stoken_v2 string
   */
  stokenV2?: string
  /**
   * The raw ltoken_v2 string
   */
  ltokenV2?: string
  /**
   * The raw cookie_token_v2 string
   */
  cookieTokenV2?: string
  /**
   * Temporary cookie (set-cookie header) for Geetest verification, only present when require_geetest
   */
  temp_cookie?: string
  /**
   * The device_id used during this login attempt.
   * Preserve and pass back on retry when status is require_geetest.
   */
  deviceId?: string
  /**
   * Action ticket for email verification, present when status is require_email_verify.
   */
  action_ticket?: IActionTicket
}

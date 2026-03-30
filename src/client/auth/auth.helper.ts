import * as crypto from 'crypto'

// HoyoVerse App overseas public key
const LOGIN_KEY_TYPE_1 = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4PMS2JVMwBsOIrYWRluY
wEiFZL7Aphtm9z5Eu/anzJ09nB00uhW+ScrDWFECPwpQto/GlOJYCUwVM/raQpAj
/xvcjK5tNVzzK94mhk+j9RiQ+aWHaTXmOgurhxSp3YbwlRDvOgcq5yPiTz0+kSeK
ZJcGeJ95bvJ+hJ/UMP0Zx2qB5PElZmiKvfiNqVUk8A8oxLJdBB5eCpqWV6CUqDKQ
KSQP4sM0mZvQ1Sr4UcACVcYgYnCbTZMWhJTWkrNXqI8TMomekgny3y+d6NX/cFa6
6jozFIF4HCX5aW8bp8C8vq2tFvFbleQ/Q3CU56EWWKMrOcpmFtRmC18s9biZBVR/
8QIDAQAB
-----END PUBLIC KEY-----`

/**
 * Encrypt passwords or accounts using HoyoVerse RSA public key.
 *
 * @param {string} text - The plain credentials text.
 * @returns {string} The base64 encrypted text.
 */
export function encryptCredentials(text: string): string {
  const buffer = Buffer.from(text, 'utf8')
  const encrypted = crypto.publicEncrypt(
    {
      key: LOGIN_KEY_TYPE_1,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    buffer,
  )
  return encrypted.toString('base64')
}

/**
 * Generate DS header needed specifically for the loginByPassword API endpoint.
 *
 * @param {Record<string, any>} body - The JSON body payload of the request.
 * @returns {string} The generated DS Header signature.
 */
export function generateAppLoginDS(body: Record<string, any>): string {
  const salt = 'IZPgfb0dRPtBeLuFkdDznSZ6f4wWt6y2'
  const t = Math.floor(Date.now() / 1000)

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let r = ''
  for (let i = 0; i < 6; i++) {
    r += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  const b = JSON.stringify(body)
  const rawStr = `salt=${salt}&t=${t}&r=${r}&b=${b}&q=`

  const hash = crypto.createHash('md5').update(rawStr).digest('hex')
  return `${t},${r},${hash}`
}

/**
 * Builds a final Aigis header utilizing the result object returned from GEETEST completion.
 *
 * @param {string} sessionId A string split from the initial \`;\` separated x-rpc-aigis data payload.
 * @param {any} mmtData The inner JSON payload associated with aigis.
 * @param {any} geetestResult Usually contains geetest_challenge, geetest_validate, geetest_seccode strings.
 * @returns {string} The raw string representing the verified x-rpc-aigis header.
 */
export function buildAigisHeader(
  sessionId: string,
  mmtData: any,
  geetestResult: any,
): string {
  const finalData = {
    ...mmtData,
    ...geetestResult,
  }

  const b64Data = Buffer.from(JSON.stringify(finalData)).toString('base64')
  return `${sessionId};${b64Data}`
}

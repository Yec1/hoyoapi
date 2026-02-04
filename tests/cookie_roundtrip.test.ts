import test from 'ava'
import { Cookie } from '../src/cookie/cookie'

test('Cookie round-trip for V2', (t) => {
  const cookieStringBase =
    'ltoken_v2=v2_token; ltuid_v2=12345; cookie_token_v2=v2_ctoken; account_mid_v2=mid; ltmid_v2=mid;'
  const parsed = Cookie.parseCookieString(cookieStringBase)

  t.is(parsed.ltokenV2, 'v2_token')
  t.is(parsed.ltuidV2, 12345)
  t.is(parsed.cookieTokenV2, 'v2_ctoken')
  t.is(parsed.accountMidV2, 'mid')
  t.is(parsed.ltmidV2, 'mid')

  // Checking if accountId and accountIdV2 are auto-filled
  t.is(parsed.accountId, 12345)
  t.is(parsed.accountIdV2, 12345)

  const serialized = Cookie.parseCookie(parsed)

  // It should contain all necessary keys in snake_case
  t.true(serialized.includes('ltoken_v2=v2_token'))
  t.true(serialized.includes('ltuid_v2=12345'))
  t.true(serialized.includes('cookie_token_v2=v2_ctoken'))
  t.true(serialized.includes('account_mid_v2=mid'))
  t.true(serialized.includes('ltmid_v2=mid'))
  t.true(serialized.includes('account_id=12345'))
  t.true(serialized.includes('account_id_v2=12345'))
})

test('Cookie round-trip for V1', (t) => {
  const cookieStringBase =
    'ltoken=v1_token; ltuid=67890; cookie_token=v1_ctoken;'
  const parsed = Cookie.parseCookieString(cookieStringBase)

  t.is(parsed.ltoken, 'v1_token')
  t.is(parsed.ltuid, 67890)
  t.is(parsed.cookieToken, 'v1_ctoken')

  const serialized = Cookie.parseCookie(parsed)

  t.true(serialized.includes('ltoken=v1_token'))
  t.true(serialized.includes('ltuid=67890'))
  t.true(serialized.includes('account_id=67890'))
})

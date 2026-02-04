import test from 'ava'
import { Cookie, HoyoAPIError } from '../src'

test('parseCookie return should be valid', (t) => {
  const cookie = Cookie.parseCookie({
    ltoken: 'ltoken',
    ltuid: 1,
    cookieToken: 'cookieToken',
    mi18nLang: 'id-id',
    cookieTokenV2: 'cookieTokenV2',
  })

  t.deepEqual(
    cookie,
    'ltoken=ltoken; ltuid=1; cookie_token=cookieToken; mi18nLang=id-id; cookie_token_v2=cookieTokenV2; account_id=1',
  )
})

test('parseCookie return should be valid with V2 keys', (t) => {
  const cookie = Cookie.parseCookie({
    ltokenV2: 'v2_ltoken',
    ltuidV2: 2,
    ltmidV2: 'v2_ltmid',
    cookieTokenV2: 'v2_cookieToken',
  })

  t.true(cookie.includes('ltoken_v2=v2_ltoken'))
  t.true(cookie.includes('ltuid_v2=2'))
  t.true(cookie.includes('ltmid_v2=v2_ltmid'))
  t.true(cookie.includes('cookie_token_v2=v2_cookieToken'))
})

test('parseCookieString return should be valid', (t) => {
  const cookieString = Cookie.parseCookieString(
    'ltoken=ltoken; ltuid=1; cookie_token=cookieToken; mi18nLang=id-id; cookie_token_v2=cookieTokenV2; account_id=1',
  )

  t.deepEqual(cookieString, {
    ltoken: 'ltoken',
    ltuid: 1,
    cookieToken: 'cookieToken',
    mi18nLang: 'id-id',
    cookieTokenV2: 'cookieTokenV2',
    accountIdV2: 1,
    accountId: 1,
  })
})

test('parseCookieString return should be valid when account_id is null', (t) => {
  const cookieString = Cookie.parseCookieString(
    'ltoken=ltoken; ltuid=1; cookie_token=cookieToken; cookie_token_v2=cookieTokenV2; mi18nLang=id-id',
  )

  t.deepEqual(cookieString, {
    ltoken: 'ltoken',
    ltuid: 1,
    cookieToken: 'cookieToken',
    mi18nLang: 'id-id',
    cookieTokenV2: 'cookieTokenV2',
    accountIdV2: 1,
    accountId: 1,
  })
})

test('parseCookieString return should be valid when ltuid is null', (t) => {
  const cookieString = Cookie.parseCookieString(
    'ltoken=ltoken; account_id=1; cookie_token_v2=cookieTokenV2; cookie_token=cookieToken; mi18nLang=id-id',
  )

  t.deepEqual(cookieString, {
    ltoken: 'ltoken',
    ltuid: 1,
    cookieToken: 'cookieToken',
    mi18nLang: 'id-id',
    accountId: 1,
    cookieTokenV2: 'cookieTokenV2',
    accountIdV2: 1,
  })
})

test('parseCookieString return should be throw errors', (t) => {
  t.throws(
    () => {
      Cookie.parseCookieString('mi18nLang=id-id')
    },
    {
      instanceOf: HoyoAPIError,
    },
  )
})

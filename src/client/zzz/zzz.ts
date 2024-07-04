import { Language, LanguageEnum } from '../../language'
import { DailyModule } from '../../module/daily'
import { RedeemModule } from '../../module/redeem'
import { IZZZOptions } from './zzz.interface'
import { Cookie, ICookie } from '../../cookie'
import { HTTPRequest } from '../../request'
import { DEFAULT_REFERER } from '../../routes'
import { getZZZRegion } from './zzz.helper'
import { GamesEnum, Hoyolab, IGame } from '../hoyolab'
import { HoyoAPIError } from '../../error'
import { ZZZRecordModule } from './record'

/**
 * The `ZZZ` class provides an interface to interact with ZZZ-related features on the Mihoyo website.
 * It contains references to various modules such as `DailyModule`, `RedeemModule`, `ZZZRecordModule`, and `ZZZDiaryModule` which allow you to perform various operations related to these features.
 *
 * @class
 * @category Main
 */
export class ZenlessZoneZero {
  /**
   * The `DailyModule` object provides an interface to interact with the daily check-in feature in Zenless Zone Zero.
   *
   */
  readonly daily: DailyModule

  /**
   * The `RedeemModule` object provides an interface to interact with the code redemption feature in Zenless Zone Zero.
   *
   */
  readonly redeem: RedeemModule

  /**
   * The `ZZZRecordModule` object provides an interface to interact with the user record feature in Honkai Star Rails.
   *
   */
  readonly record: ZZZRecordModule

  /**
   * HoyYolab account object
   *
   */
  private _account: IGame | null = null

  /**
   * The cookie object to be used in requests.
   */
  readonly cookie: ICookie

  /**
   * The `Request` object used to make requests.
   */
  private request: HTTPRequest

  /**
   * The UID of the user, if available.
   */
  readonly uid: number | null

  /**
   * The region of the user, if available.
   */
  readonly region: string | null

  /**
   * The language to be used in requests.
   */
  private lang: LanguageEnum

  /**
   * Constructs a new `ZZZ` object.
   *
   * @param options The options object used to configure the object.
   */
  constructor(options: IZZZOptions) {
    const cookie: ICookie =
      typeof options.cookie === 'string'
        ? Cookie.parseCookieString(options.cookie)
        : options.cookie

    this.cookie = cookie

    if (!options.lang) {
      options.lang = Language.parseLang(cookie.mi18nLang)
    }

    // Parse language to prevent language error
    options.lang = Language.parseLang(options.lang)

    this.request = new HTTPRequest(Cookie.parseCookie(this.cookie))
    this.request.setReferer(DEFAULT_REFERER)
    this.request.setLang(options.lang)

    this.uid = options.uid ?? null
    this.region = this.uid !== null ? getZZZRegion(this.uid) : null
    this.lang = options.lang

    this.daily = new DailyModule(
      this.request,
      this.lang,
      GamesEnum.ZENLESS_ZONE_ZERO,
      this.region,
    )
    this.redeem = new RedeemModule(
      this.request,
      this.lang,
      GamesEnum.ZENLESS_ZONE_ZERO,
      this.region,
      this.uid,
    )
    this.record = new ZZZRecordModule(
      this.request,
      this.lang,
      this.region,
      this.uid,
    )
  }

  /**
   * Create a new instance of the ZenlessZoneZero class asynchronously.
   *
   * @param options The options object used to configure the object.
   * @throws {HoyoAPIError} Error Wnen the CookieTokenV2 is not set.
   * @returns {Promise<ZenLessZoneZero>} A promise that resolves with a new ZZZ instance.
   *
   * @remarks
   * If an object is instantiated from this method but options.cookie.cookieTokenV2 is not set,
   * it will throw an error. This method will access an Endpoint that contains a list of game accounts,
   * which requires the cookieTokenV2 option.

   * @remarks
   * Because CookieTokenV2 has a short expiration time and cannot be refreshed so far.
   * It is evident that every few days, when logging in, it always requests authentication first.
   * Therefore, this method that uses CookieTokenV2 is not suitable if filled statically.
   */
  static async create(options: IZZZOptions): Promise<ZenlessZoneZero> {
    try {
      let game: IGame | null = null

      if (typeof options.uid === 'undefined') {
        const hoyolab = new Hoyolab({
          cookie: options.cookie,
        })

        game = await hoyolab.gameAccount(GamesEnum.ZENLESS_ZONE_ZERO)
        options.uid = parseInt(game.game_uid)
      }

      const zzz = new ZenlessZoneZero(options)
      zzz.account = game
      return zzz
    } catch (error: any) {
      throw new HoyoAPIError(error.message, error.code)
    }
  }

  /**
   * Setter for the account property. Prevents from changing the value once set
   * @param game The game object to set as the account.
   */
  public set account(game: IGame | null) {
    if (this.account === null && game !== null) {
      this._account = game
    }
  }

  /**
   * Getter for the account property.
   * @returns {IGame | null} The current value of the account property.
   */
  public get account(): IGame | null {
    return this._account
  }

  /**
   * Retrieves daily information.
   *
   * @alias {@link ZenLessZoneZero.daily | ZZZ.daily.info()}
   * @deprecated Use through {@link ZenLessZoneZero.daily | ZZZ.daily.info()} instead
   */
  dailyInfo() {
    return this.daily.info()
  }

  /**
   * Retrieve daily rewards information.
   *
   * @alias {@link ZenLessZoneZero.daily | ZZZ.daily.rewards()}
   * @deprecated Use through {@link ZenLessZoneZero.daily | ZZZ.daily.rewards()} instead
   */
  dailyRewards() {
    return this.daily.rewards()
  }

  /**
   * Get the daily reward for a specific day or the current day
   *
   * @param day number | null
   * @alias {@link ZenLessZoneZero.daily | ZZZ.daily.reward()}
   * @deprecated Use through {@link ZenLessZoneZero.daily | ZZZ.daily.reward()} instead
   */
  dailyReward(day: number | null = null) {
    return this.daily.reward(day)
  }

  /**
   * Claim current reward
   *
   * @alias {@link ZenLessZoneZero.daily | ZZZ.daily.claim()}
   * @deprecated Use through {@link ZenLessZoneZero.daily | ZZZ.daily.claim()} instead
   */
  dailyClaim() {
    return this.daily.claim()
  }

  /**
   * Redeems a code for a specific account.
   *
   * @param code string
   * @alias {@link ZenLessZoneZero.daily | ZZZ.redeem.claim()}
   * @deprecated Use through {@link ZenLessZoneZero.daily | ZZZ.redeem.claim()} instead
   */
  redeemCode(code: string) {
    return this.redeem.claim(code)
  }
}

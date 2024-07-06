import { HoyoAPIError } from '../../../error'
import { LanguageEnum } from '../../../language'
import { HTTPRequest } from '../../../request'
import { HSR_DIARY_DETAIL_API, HSR_DIARY_LIST_API } from '../../../routes'
import {
  HSRDiaryEnum,
  HSRDiaryMonthEnum,
  IHSRDiaryDetail,
  IHSRDiaryInfo,
} from './diary.interface'

/**
 * A module to interact with the Honkai Star Rail diary endpoints of the Hoyolab API
 *
 * @public
 * @internal
 * @category Module
 */
export class HSRDiaryModule {
  /**
   * Constructs a DiaryModule instance
   *
   * @param request - An instance of the Request class to make HTTP requests
   * @param lang - A LanguageEnum value for the language of the user
   * @param region - A string value for the region of the user
   * @param uid - A number value for the UID of the user
   */
  constructor(
    private request: HTTPRequest,
    private lang: LanguageEnum,
    private region: string | null,
    private uid: number | null,
  ) {}

  /**
   * Returns the diary information of a given month for a user
   *
   * @param month - A DiaryMonthEnum value for the month of the diary information requested. Default is CURRENT.
   * @returns A promise that resolves to an IHSRDiaryInfo object
   * @throws {@link HoyoAPIError} when the uid or region parameter is missing or invalid
   * @remarks
   * This method sends a request to the Honkai Star Rail API to get the daily note information for a user.
   * The user's region and UID must be set before calling this method, otherwise an error will be thrown.
   */
  async list(
    month: HSRDiaryMonthEnum = HSRDiaryMonthEnum.CURRENT,
  ): Promise<IHSRDiaryInfo> {
    if (!this.region || !this.uid) {
      throw new HoyoAPIError('UID parameter is missing or failed to be filled')
    }

    if (Object.values(HSRDiaryMonthEnum).includes(month) === false) {
      throw new HoyoAPIError('The given month parameter is invalid !')
    }

    this.request
      .setQueryParams({
        region: this.region,
        uid: this.uid,
        month,
        lang: this.lang,
      })
      .setDs()

    const {
      response: res,
      params,
      body,
      headers,
    } = await this.request.send(HSR_DIARY_LIST_API)

    if (res.retcode !== 0) {
      throw new HoyoAPIError(
        res.message ??
          'Failed to retrieve data, please double-check the provided UID.',
        res.retcode,
        {
          response: res,
          request: {
            body,
            headers,
            params,
          },
        },
      )
    }

    return res.data as IHSRDiaryInfo
  }

  /**
   * Returns the diary details of a given type and month for a user
   *
   * @param type - A HSRDiaryEnum value for the type of diary details requested
   * @param month - A DiaryMonthEnum value for the month of the diary details requested. Default is CURRENT.
   * @returns A promise that resolves to an IHSRDiaryDetail object
   * @throws {@link HoyoAPIError} when the uid or region parameter is missing or invalid, or when the type or month parameter is invalid
   * @remarks
   * This method sends a request to the Honkai Star Rail API to get the daily note information for a user.
   * The user's region and UID must be set before calling this method, otherwise an error will be thrown.
   */
  async detail(
    type: HSRDiaryEnum,
    month: HSRDiaryMonthEnum = HSRDiaryMonthEnum.CURRENT,
  ): Promise<IHSRDiaryDetail> {
    if (!this.region || !this.uid) {
      throw new HoyoAPIError('UID parameter is missing or failed to be filled')
    }

    if (Object.values(HSRDiaryMonthEnum).includes(month) === false) {
      throw new HoyoAPIError('The given month parameter is invalid !')
    }

    if (Object.values(HSRDiaryEnum).includes(type) === false) {
      throw new HoyoAPIError('The given type parameter is invalid !')
    }

    const responses: Partial<IHSRDiaryDetail> = {}

    let page = 1
    let next = true
    do {
      this.request
        .setQueryParams({
          region: this.region,
          uid: this.uid,
          month,
          type,
          current_page: page,
          page_size: 100,
          lang: this.lang,
        })
        .setDs()

      const {
        response: res,
        params,
        body,
        headers,
      } = await this.request.send(HSR_DIARY_DETAIL_API)

      if (res.retcode !== 0) {
        throw new HoyoAPIError(
          res.message ??
            'Failed to retrieve data, please double-check the provided UID.',
          res.retcode,
          {
            response: res,
            request: {
              body,
              headers,
              params,
            },
          },
        )
      }
      const data = res.data as IHSRDiaryDetail

      responses.uid = data.uid
      responses.region = data.region
      responses.optional_month = data.optional_month
      responses.nickname = data.nickname
      responses.data_month = data.data_month
      responses.current_page = data.current_page
      responses.list = [...(responses.list ?? []), ...data.list]

      if (data.list.length < 1) {
        next = false
      }

      page++
    } while (next)

    responses.list.sort((a, b) => {
      const keyA = new Date(a.time)
      const keyB = new Date(b.time)

      // Compare the 2 dates
      if (keyA < keyB) return -1
      if (keyA > keyB) return 1

      return 0
    })

    return responses as IHSRDiaryDetail
  }
}

import { HoyoAPIError } from '../../../error'
import { LanguageEnum } from '../../../language'
import { HTTPRequest } from '../../../request'
import {
  ZZZ_RECORD_INDEX_API,
  ZZZ_RECORD_CHARACTER_API,
  ZZZ_RECORD_NOTE_API,
  ZZZ_RECORD_SHIYU_DEFENSE_API,
  ZZZ_RECORD_CHARACTER_LIST_API,
  ZZZ_RECORD_DEADLY_ASSAULT_API,
} from '../../../routes'
import {
  IZZZCharacterFull,
  IZZZShiyuDefense,
  IZZZNote,
  IZZZRecord,
  IZZZDeadlyAssault,
} from './interfaces'
import { ShiyuDefenseScheduleEnum, DeadlyAssaultScheduleEnum } from './record.enum'

/**
 * ZZZRecordModule class provides methods to interact with Honkai Star Rail record module endpoints.
 *
 * @class
 * @internal
 * @category Module
 */
export class ZZZRecordModule {
  /**
   * Creates an instance of ZZZRecordModule.
   *
   * @param request The HTTPRequest object used for making API requests.
   * @param lang The language enum value.
   * @param region The region string or null if not provided.
   * @param uid The UID number or null if not provided.
   */
  constructor(
    private request: HTTPRequest,
    private lang: LanguageEnum,
    private region: string | null,
    private uid: number | null,
  ) {}

  /**
   * Retrieves the characters associated with the provided region and UID.
   *
   * @returns {Promise<IZZZCharacterFull[]>} A Promise that resolves to an array of full ZZZ characters.
   * @throws {HoyoAPIError} if the region or UID parameters are missing or failed to be filled.
   * @throws {HoyoAPIError} if failed to retrieve data, please double-check the provided UID.
   */
  async characters(): Promise<IZZZCharacterFull[]> {
    if (!this.region || !this.uid) {
      throw new HoyoAPIError('UID parameter is missing or failed to be filled')
    }

    this.request
      .setQueryParams({
        server: this.region,
        role_id: this.uid,
        lang: this.lang,
      })
      .setDs(true)

    const {
      response: res,
      body,
      params,
      headers,
    } = await this.request.send(ZZZ_RECORD_CHARACTER_LIST_API)

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

    const data = res.data as any
    return data.avatar_list as IZZZCharacterFull[]
  }

  /**
   * Retrieves the character associated with the provided region and UID.
   *
   * @param characterId Character ID to retrieve.
   * @returns {Promise<IZZZCharacterFull>} A Promise that resolves to a ZZZ character.
   * @throws {HoyoAPIError} if the region or UID parameters are missing or failed to be filled.
   * @throws {HoyoAPIError} if the character ID parameter is missing or failed to be filled.
   * @throws {HoyoAPIError} if failed to retrieve data, please double-check the provided UID.
   */
  async character(characterId: number): Promise<IZZZCharacterFull> {
    if (!this.region || !this.uid) {
      throw new HoyoAPIError('UID parameter is missing or failed to be filled')
    }

    if (!characterId) {
      throw new HoyoAPIError(
        'Character ID parameter is missing or failed to be filled',
      )
    }

    this.request
      .setQueryParams({
        server: this.region,
        role_id: this.uid,
        lang: this.lang,
      })
      .setDs(true)

    const {
      response: res,
      body,
      params,
      headers,
    } = await this.request.send(
      ZZZ_RECORD_CHARACTER_API + '?id_list[]=' + characterId,
    )

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

    const data = res.data as any
    return data.avatar_list as IZZZCharacterFull
  }

  /**
   * Retrieves the records associated with the provided region and UID.
   *
   * @returns {Promise<IZZZRecord>} A Promise that resolves to the ZZZ record object.
   * @throws {HoyoAPIError} if the region or UID parameters are missing or failed to be filled.
   * @throws {HoyoAPIError} if failed to retrieve data, please double-check the provided UID.
   */
  async records(): Promise<IZZZRecord> {
    if (!this.region || !this.uid) {
      throw new HoyoAPIError('UID parameter is missing or failed to be filled')
    }

    this.request
      .setQueryParams({
        server: this.region,
        role_id: this.uid,
        lang: this.lang,
      })
      .setDs(true)

    const {
      response: res,
      body,
      params,
      headers,
    } = await this.request.send(ZZZ_RECORD_INDEX_API)

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

    return res.data as IZZZRecord
  }

  /**
   * Retrieves the note associated with the provided region and UID.
   *
   * @returns {Promise<IZZZNote>} A Promise that resolves to the ZZZ note object.
   * @throws {HoyoAPIError} if the region or UID parameters are missing or failed to be filled.
   * @throws {HoyoAPIError} if failed to retrieve data, please double-check the provided UID.
   */
  async note(): Promise<IZZZNote> {
    if (!this.region || !this.uid) {
      throw new HoyoAPIError('UID parameter is missing or failed to be filled')
    }

    this.request
      .setQueryParams({
        server: this.region,
        role_id: this.uid,
        lang: this.lang,
      })
      .setDs(true)

    const {
      response: res,
      body,
      params,
      headers,
    } = await this.request.send(ZZZ_RECORD_NOTE_API)

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

    return res.data as IZZZNote
  }

  /**
   * Retrieves the shiyu defense information associated with the provided region and UID.
   *
   * @param scheduleType The schedule type for the shiyu defense (optional, defaults to CURRENT).
   * @returns {Promise<IZZZShiyuDefense>} A Promise that resolves to the shiyu defense information object.
   * @throws {HoyoAPIError} if the region or UID parameters are missing or failed to be filled.
   * @throws {HoyoAPIError} if the given scheduleType parameter is invalid.
   * @throws {HoyoAPIError} if failed to retrieve data, please double-check the provided UID.
   */
  async shiyuDefense(
    scheduleType: ShiyuDefenseScheduleEnum = ShiyuDefenseScheduleEnum.CURRENT,
  ): Promise<IZZZShiyuDefense> {
    if (!this.region || !this.uid) {
      throw new HoyoAPIError('UID parameter is missing or failed to be filled')
    }

    if (
      Object.values(ShiyuDefenseScheduleEnum).includes(scheduleType) === false
    ) {
      throw new HoyoAPIError('The given scheduleType parameter is invalid !')
    }

    this.request
      .setQueryParams({
        server: this.region,
        role_id: this.uid,
        schedule_type: scheduleType,
        lang: this.lang,
        need_all: 'true',
      })
      .setDs()

    const {
      response: res,
      body,
      params,
      headers,
    } = await this.request.send(ZZZ_RECORD_SHIYU_DEFENSE_API)

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

    return res.data as IZZZShiyuDefense
  }

   /**
   * Retrieves the deadly assault information associated with the provided region and UID.
   *
   * @param scheduleType The schedule type for the deadly assault (optional, defaults to CURRENT).
   * @returns {Promise<IZZZDeadlyAssault>} A Promise that resolves to the deadly assault information object.
   * @throws {HoyoAPIError} if the region or UID parameters are missing or failed to be filled.
   * @throws {HoyoAPIError} if the given scheduleType parameter is invalid.
   * @throws {HoyoAPIError} if failed to retrieve data, please double-check the provided UID.
   */
   async deadlyAssault(
    scheduleType: DeadlyAssaultScheduleEnum = DeadlyAssaultScheduleEnum.CURRENT,
  ): Promise<IZZZDeadlyAssault> {
    if (!this.region || !this.uid) {
      throw new HoyoAPIError('UID parameter is missing or failed to be filled')
    }

    if (
      Object.values(DeadlyAssaultScheduleEnum).includes(scheduleType) === false
    ) {
      throw new HoyoAPIError('The given scheduleType parameter is invalid !')
    }

    this.request
      .setQueryParams({
        region: this.region,
        uid: this.uid,
        schedule_type: scheduleType,
        lang: this.lang,
        need_all: 'true',
      })
      .setDs()

    const {
      response: res,
      body,
      params,
      headers,
    } = await this.request.send(ZZZ_RECORD_DEADLY_ASSAULT_API)

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

    return res.data as IZZZDeadlyAssault
  }
}

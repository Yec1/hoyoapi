import { LanguageEnum } from '../../language'
import { HTTPRequest } from '../../request'
import {
  MIMO_INDEX_API,
  MIMO_TASK_LIST_API,
  MIMO_FINISH_TASK_API,
  MIMO_RECEIVE_POINT_API,
  MIMO_EXCHANGE_LIST_API,
  MIMO_EXCHANGE_API,
  MIMO_LOTTERY_INFO_API,
  MIMO_LOTTERY_API,
} from '../../routes'
import {
  IMimoTask,
  IMimoGame,
  IMimoExchangeItem,
  IMimoExchangeResult,
  IMimoLotteryInfo,
} from './mimo.interface'

/**
 * MimoModule provides methods to interact with Hoyolab's Traveling Mimo event.
 * Supports HSR (game_id=6) and ZZZ (game_id=8).
 *
 * @public
 * @class
 * @category Module
 */
export class MimoModule {
  /**
   * @param request - HTTPRequest instance with auth cookies set.
   * @param lang - Language for API responses.
   * @param gameId - Mimo game ID (6 = HSR, 8 = ZZZ).
   */
  constructor(
    private request: HTTPRequest,
    private lang: LanguageEnum,
    private gameId: number,
  ) {}

  /**
   * Fetches the current Mimo version_id for this game.
   * Returns null if the event is not active.
   */
  async getVersionId(): Promise<string | null> {
    this.request.setQueryParams({ lang: this.lang })
    const { response } = await this.request.send(MIMO_INDEX_API, 'GET', 0)
    const list = (response as any)?.list as IMimoGame[] | undefined
    return list?.find((g) => g.game_id === this.gameId)?.version_id ?? null
  }

  /**
   * Retrieves the list of Mimo tasks for the current version.
   *
   * @param versionId - The version_id from {@link getVersionId}.
   */
  async tasks(versionId: string): Promise<IMimoTask[]> {
    this.request.setQueryParams({
      game_id: this.gameId,
      lang: this.lang,
      version_id: versionId,
    })
    const { response } = await this.request.send(MIMO_TASK_LIST_API, 'GET', 0)
    return ((response as any)?.list as IMimoTask[]) ?? []
  }

  /**
   * Marks a task as finished (triggers completion for click-type tasks).
   *
   * @param versionId - The current version_id.
   * @param taskId - ID of the task to finish.
   */
  async finishTask(versionId: string, taskId: number): Promise<boolean> {
    this.request.setBody({
      game_id: this.gameId,
      lang: this.lang,
      version_id: versionId,
      task_id: taskId,
    })
    const { response } = await this.request.send(
      MIMO_FINISH_TASK_API,
      'POST',
      0,
    )
    return (response as any)?.retcode === 0 || true
  }

  /**
   * Claims the reward points for a completed task.
   *
   * @param versionId - The current version_id.
   * @param taskId - ID of the completed task.
   */
  async claimTask(versionId: string, taskId: number): Promise<boolean> {
    this.request.setQueryParams({
      game_id: this.gameId,
      lang: this.lang,
      version_id: versionId,
      task_id: taskId,
    })
    const { response } = await this.request.send(
      MIMO_RECEIVE_POINT_API,
      'GET',
      0,
    )
    return !!(response as any)
  }

  /**
   * Completes all pending tasks and claims their rewards in one call.
   * Returns the number of tasks successfully claimed.
   */
  async claimAllTasks(): Promise<number> {
    const versionId = await this.getVersionId()
    if (!versionId) return 0

    const taskList = await this.tasks(versionId)
    let claimed = 0

    for (const task of taskList) {
      if (task.status === 0) {
        await this.finishTask(versionId, task.id)
        if (await this.claimTask(versionId, task.id)) claimed++
      } else if (task.status === 1) {
        if (await this.claimTask(versionId, task.id)) claimed++
      }
    }

    return claimed
  }

  /**
   * Retrieves the Mimo shop exchange items.
   *
   * @param versionId - The current version_id.
   */
  async exchangeList(versionId: string): Promise<IMimoExchangeItem[]> {
    this.request.setQueryParams({
      game_id: this.gameId,
      lang: this.lang,
      version_id: versionId,
    })
    const { response } = await this.request.send(
      MIMO_EXCHANGE_LIST_API,
      'GET',
      0,
    )
    return ((response as any)?.list as IMimoExchangeItem[]) ?? []
  }

  /**
   * Exchanges points for a shop item (typically returns a gift code).
   *
   * @param versionId - The current version_id.
   * @param awardId - The award_id of the shop item.
   */
  async exchange(
    versionId: string,
    awardId: string,
  ): Promise<IMimoExchangeResult> {
    this.request.setBody({
      game_id: this.gameId,
      lang: this.lang,
      version_id: versionId,
      award_id: awardId,
    })
    const { response } = await this.request.send(MIMO_EXCHANGE_API, 'POST', 0)
    return response as unknown as IMimoExchangeResult
  }

  /**
   * Gets current lottery state (total points, cost per draw, draws done).
   *
   * @param versionId - The current version_id.
   */
  async lotteryInfo(versionId: string): Promise<IMimoLotteryInfo> {
    this.request.setQueryParams({
      game_id: this.gameId,
      lang: this.lang,
      version_id: versionId,
    })
    const { response } = await this.request.send(
      MIMO_LOTTERY_INFO_API,
      'GET',
      0,
    )
    return response as unknown as IMimoLotteryInfo
  }

  /**
   * Performs one lottery draw.
   *
   * @param versionId - The current version_id.
   */
  async lottery(versionId: string): Promise<boolean> {
    this.request.setBody({
      game_id: this.gameId,
      lang: this.lang,
      version_id: versionId,
    })
    const { response } = await this.request.send(MIMO_LOTTERY_API, 'POST', 0)
    return !!(response as any)
  }
}

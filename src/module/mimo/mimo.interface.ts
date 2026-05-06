/**
 * Represents a single Mimo travel task.
 * @interface
 */
export interface IMimoTask {
  id: number
  name: string
  /** 0: incomplete, 1: complete but unclaimed, 2: claimed */
  status: number
  is_finish: boolean
  task_type: number
}

/**
 * Response from mimo index endpoint — lists active Mimo games.
 * @interface
 */
export interface IMimoGame {
  game_id: number
  version_id: string
}

/**
 * Mimo shop exchange item.
 * @interface
 */
export interface IMimoExchangeItem {
  award_id: string
  name: string
  icon: string
  cost: number
  stock: number
  limit: number
  exchange_num: number
}

/**
 * Result of a Mimo exchange (gift code redemption).
 * @interface
 */
export interface IMimoExchangeResult {
  code: string
}

/**
 * Mimo lottery state.
 * @interface
 */
export interface IMimoLotteryInfo {
  total_points: number
  cost_points: number
  lottery_times: number
}

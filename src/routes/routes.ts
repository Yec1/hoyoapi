import { GamesEnum } from '../client/hoyolab'

/* c8 ignore start */

/* Main API Endpoint */
export const BBS_API = 'https://bbs-api-os.hoyolab.com'
export const ACCOUNT_API = 'https://api-account-os.hoyolab.com'
export const HK4E_API = 'https://sg-hk4e-api.hoyolab.com'
export const HKRPG_API = 'https://sg-hkrpg-api.hoyoverse.com'
export const PUBLIC_API = 'https://sg-public-api.hoyolab.com'
export const DEFAULT_REFERER = 'https://hoyolab.com'
export const TAKUMI_API = 'https://api-os-takumi.mihoyo.com'
export const NAP_API = 'https://sg-public-api.hoyolab.com'

/* HoYoLab API Endpoint */
export const USER_GAMES_LIST = `${ACCOUNT_API}/account/binding/api/getUserGameRolesByCookieToken`
export const GAME_RECORD_CARD_API = `${PUBLIC_API}/event/game_record/card/wapi/getGameRecordCard`

const getEventName = (game: GamesEnum) => {
  if (game == GamesEnum.GENSHIN_IMPACT) {
    return 'sol'
  } else if (game === GamesEnum.HONKAI_IMPACT) {
    return 'mani'
  } else if (game === GamesEnum.HONKAI_STAR_RAIL) {
    return 'luna/os'
  } else if (game === GamesEnum.ZENLESS_ZONE_ZERO) {
    return 'luna/zzz/os'
  }

  return ''
}

const getEventBaseUrl = (game: GamesEnum) => {
  if (game === GamesEnum.GENSHIN_IMPACT) {
    return HK4E_API
  } else if (
    game === GamesEnum.HONKAI_IMPACT ||
    game === GamesEnum.HONKAI_STAR_RAIL
  ) {
    return PUBLIC_API
  } else if (game === GamesEnum.ZENLESS_ZONE_ZERO) {
    return NAP_API
  }

  return ''
}

const getActId = (game: GamesEnum) => {
  if (game === GamesEnum.GENSHIN_IMPACT) {
    return 'e202102251931481'
  } else if (game === GamesEnum.HONKAI_IMPACT) {
    return 'e202110291205111'
  } else if (game === GamesEnum.HONKAI_STAR_RAIL) {
    return 'e202303301540311'
  } else if (game == GamesEnum.ZENLESS_ZONE_ZERO) {
    return 'e202406031448091'
  }

  return ''
}

/* Daily Check-In API Endpoint */
export const DAILY_INFO_API = (game: GamesEnum) => {
  return `${getEventBaseUrl(game)}/event/${getEventName(
    game,
  )}/info?act_id=${getActId(game)}`
}

export const DAILY_REWARD_API = (game: GamesEnum) => {
  return `${getEventBaseUrl(game)}/event/${getEventName(
    game,
  )}/home?act_id=${getActId(game)}`
}

export const DAILY_CLAIM_API = (game: GamesEnum) => {
  return `${getEventBaseUrl(game)}/event/${getEventName(
    game,
  )}/sign?act_id=${getActId(game)}`
}

/* Redeem API Endpoint */
export const GENSHIN_REDEEM_CLAIM_API = `${HK4E_API}/common/apicdkey/api/webExchangeCdkey`
export const HSR_REDEEM_CLAIM_API = `${HKRPG_API}/common/apicdkey/api/webExchangeCdkey`
export const HI_REDEEM_CLAIM_API = `${HKRPG_API}/common/apicdkey/api/webExchangeCdkey` // This is not correct api
export const ZZZ_REDEEM_CLAIM_API = `https://public-operation-nap.hoyoverse.com/common/apicdkey/api/webExchangeCdkey`

/* Genshin Impact Battle Chronicles */
export const GENSHIN_RECORD_INDEX_API = `${BBS_API}/game_record/genshin/api/index`
export const GENSHIN_RECORD_CHARACTER_API = `${BBS_API}/game_record/genshin/api/character`
export const GENSHIN_RECORD_AVATAR_BASIC_INFO_API = `${BBS_API}/game_record/genshin/api/avatarBasicInfo`
export const GENSHIN_RECORD_SPIRAL_ABYSS_API = `${BBS_API}/game_record/genshin/api/spiralAbyss`
export const GENSHIN_RECORD_DAILY_NOTE_API = `${BBS_API}/game_record/genshin/api/dailyNote`

/* Genshin Impact Diary */
export const GENSHIN_DIARY_LIST_API = `${HK4E_API}/event/ysledgeros/month_info`
export const GENSHIN_DIARY_DETAIL_API = `${HK4E_API}/event/ysledgeros/month_detail`

/* Genshin TCG Data*/
export const GENSHIN_TCG_BASICINFO = `${BBS_API}/game_record/genshin/api/gcg/basicInfo`
export const GENSHIN_TCG_CARDLIST = `${BBS_API}/game_record/genshin/api/gcg/cardList`
export const GENSHIN_TCG_MATCHLIST = `${BBS_API}/game_record/genshin/api/gcg/matchList`
export const GENSHIN_TCG_CHALLANGE_SCHEDULE = `${BBS_API}/game_record/genshin/api/gcg/challenge/schedule`
export const GENSHIN_TCG_CHALLANGE_RECORD = `${BBS_API}/game_record/genshin/api/gcg/challenge/record`
export const GENSHIN_TCG_CHALLANGE_DECK = `${BBS_API}/game_record/genshin/api/gcg/challenge/deck`

/* HSR Battle Chronicles */
export const HSR_RECORD_CHARACTER_API = `${PUBLIC_API}/event//game_record/hkrpg/api/avatar/info`
export const HSR_RECORD_INDEX_API = `${PUBLIC_API}/event//game_record/hkrpg/api/index`
export const HSR_RECORD_NOTE_API = `${PUBLIC_API}/event//game_record/hkrpg/api/note`
export const HSR_RECORD_WIDGET_API = `${PUBLIC_API}/event//game_record/hkrpg/aapi/widget`
export const HSR_RECORD_FORGOTTEN_HALL_API = `${PUBLIC_API}/event/game_record/hkrpg/api/challenge`
export const HSR_RECORD_PURE_FICTION_API = `${PUBLIC_API}/event/game_record/hkrpg/api/challenge_story`
export const HSR_RECORD_APOCALYPSE_PHANTOM_API = `${PUBLIC_API}/event/game_record/hkrpg/api/challenge_boss`

/* HSR Diary */
export const HSR_DIARY_LIST_API = `${HKRPG_API}/event/srledger/month_info`
export const HSR_DIARY_DETAIL_API = `${HKRPG_API}/event/srledger/month_detail`

/* ZZZ Battle Chronicles */
export const ZZZ_RECORD_INDEX_API = `${PUBLIC_API}/event/game_record_zzz/api/zzz/index`
export const ZZZ_BANBOO_API = `${PUBLIC_API}/event/game_record_zzz/api/zzz/buddy/info`
export const ZZZ_RECORD_CHARACTER_LIST_API = `${PUBLIC_API}/event/game_record_zzz/api/zzz/avatar/basic`
export const ZZZ_RECORD_CHARACTER_API = `${PUBLIC_API}/event/game_record_zzz/api/zzz/avatar/info` // /info?id_list[]=1041 <-- Character ID
export const ZZZ_RECORD_NOTE_API = `${PUBLIC_API}/event/game_record_zzz/api/zzz/note`
export const ZZZ_RECORD_SHIYU_DEFENSE_API = `${PUBLIC_API}/event/game_record_zzz/api/zzz/challenge`
export const ZZZ_RECORD_DEADLY_ASSAULT_API = `${PUBLIC_API}/event/game_record_zzz/api/zzz/mem_detail`

/* Honkai Impact Battle Chronicles */
export const HI_RECORD_INDEX_API = `${BBS_API}/game_record/honkai3rd/api/index`
export const HI_RECORD_CHARACTER_API = `${BBS_API}/game_record/honkai3rd/api/characters`
export const HI_RECORD_ABYSS_API = `${BBS_API}/game_record/honkai3rd/api/latestOldAbyssReport`
export const HI_RECORD_ELYSIAN_API = `${BBS_API}/game_record/honkai3rd/api/godWar`
export const HI_RECORD_ARENA_API = `${BBS_API}/game_record/honkai3rd/api/battleFieldReport`

/* c8 ignore stop */

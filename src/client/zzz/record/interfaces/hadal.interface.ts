export interface IZZZHadalTime {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

export interface IZZZHadal {
  hadal_ver: string
  hadal_info_v2: IZZZHadalInfo
  nick_name: string
  icon: string
}

export interface IZZZHadalInfo {
  zone_id: number
  hadal_begin_time: IZZZHadalTime
  hadal_end_time: IZZZHadalTime
  pass_fifth_floor: boolean
  brief: IZZZHadalBrief
  fitfh_layer_detail: IZZZHadalLayerDetail
  fourth_layer_detail: IZZZHadalLayerDetail
  begin_time: string
  end_time: string
}

export interface IZZZHadalBrief {
  cur_period_zone_layer_count: number
  score: number
  rank_percent: number
  battle_time: number
  rating: string
  challenge_time: IZZZHadalTime
  max_score: number
}

export interface IZZZHadalLayerDetail {
  layer_challenge_info_list: IZZZHadalLayerChallenge[]
  buffer?: IZZZHadalBuffer
  challenge_time?: IZZZHadalTime
  rating?: string
}

export interface IZZZHadalLayerChallenge {
  layer_id: number
  rating?: string
  buffer?: IZZZHadalBuffer
  score?: number
  avatar_list: IZZZHadalAvatar[]
  buddy: IZZZHadalBuddy
  battle_time: number
  monster_pic?: string
  max_score?: number
}

export interface IZZZHadalBuffer {
  title: string
  text: string
}

export interface IZZZHadalAvatar {
  id: number
  level: number
  rarity: string
  element_type: number
  avatar_profession: number
  rank: number
  role_square_url: string
  sub_element_type: number
}

export interface IZZZHadalBuddy {
  id: number
  rarity: string
  level: number
  bangboo_rectangle_url: string
}

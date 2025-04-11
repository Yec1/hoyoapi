export interface IZZZShiyuDefenseTime {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second?: number
}

export interface IZZZShiyuDefense {
  schedule_id: number
  begin_time: IZZZShiyuDefenseTime
  end_time: IZZZShiyuDefenseTime
  rating_list: any
  has_data: boolean
  all_floor_detail: any
  fast_layer_time: number
  max_layer: number
  hadal_begin_time: IZZZShiyuDefenseTime
  hadal_end_time: IZZZShiyuDefenseTime
}
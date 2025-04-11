export interface IZZZDeadlyAssaultTime {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second?: number
}

export interface IZZZDeadlyAssault {
    schedule_id?: number
    zone_id?: number
    begin_time?: IZZZDeadlyAssaultTime
    end_time?: IZZZDeadlyAssaultTime
    start_time?: IZZZDeadlyAssaultTime
    rating_list?: any
    has_data: boolean
    nick_name?: string
    avatar_icon?: string
    rank_percent?: number
    total_score?: number
    total_star?: number
    list?: IZZZDeadlyAssaultRecord[]
  }
  
  export interface IZZZDeadlyAssaultRecord {
    score: number
    star: number
    total_star: number
    challenge_time: IZZZDeadlyAssaultTime
    boss: IZZZDeadlyAssaultBoss[]
    buffer: IZZZDeadlyAssaultBuffer[]
    avatar_list: IZZZDeadlyAssaultAvatar[]
    buddy: IZZZDeadlyAssaultBuddy
  }
  
  export interface IZZZDeadlyAssaultBoss {
    icon: string
    name: string
    race_icon: string
    bg_icon: string
  }
  
  export interface IZZZDeadlyAssaultBuffer {
    icon: string
    desc: string
    name: string
  }
  
  export interface IZZZDeadlyAssaultAvatar {
    id: number
    level: number
    element_type: number
    avatar_profession: number
    rarity: string
    rank: number
    role_square_url: string
    sub_element_type: number
  }
  
  export interface IZZZDeadlyAssaultBuddy {
    id: number
    rarity: string
    level: number
    bangboo_rectangle_url: string
  }
  
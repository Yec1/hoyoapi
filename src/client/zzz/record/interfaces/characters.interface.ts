export interface IZZZEquipment {
  id: number
  level: number
  star: number
  rarity: string
  name: string
  talent_content: string
  icon: string
}

export interface IZZZRelic {
  id: number
  level: number
  pos: number
  name: string
  desc: string
  icon: string
  rarity: number
}

export interface IZZZOrnament extends IZZZRelic {}

export interface IZZZRank {
  id: number
  pos: number
  name: string
  icon: string
  desc: string
  is_unlocked: boolean
}

export interface IZZZCharacterBase {
  id: number
  level: number
  name: string
  element: string
  icon: string
  rarity: number
  rank: number
}
export interface IZZZCharacterSummary extends IZZZCharacterBase {
  is_chosen: false
}

export interface IZZZCharacterFull extends IZZZCharacterBase {
  image: string
  equip: IZZZEquipment | null
  relics: IZZZRelic[]
  ornaments: IZZZOrnament[]
  ranks: IZZZRank[]
}

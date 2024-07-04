import { IZZZCharacterSummary } from './characters.interface'
import { IZZZStats } from './stats.interface'

export interface IZZZRecord {
  avatar_list: IZZZCharacterSummary[]
  stats: IZZZStats
}

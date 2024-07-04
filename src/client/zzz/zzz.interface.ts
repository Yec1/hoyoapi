import { IHoyolabOptions } from '../hoyolab'

export enum ZZZRegion {
  USA = 'prod_gf_usa',
  EUROPE = 'prod_gf_eur',
  ASIA = 'prod_gf_jp',
  CHINA_TAIWAN = 'prod_gf_cht',
}

export type ZZZRegionKeyType = keyof typeof ZZZRegion

export interface IZZZOptions extends IHoyolabOptions {
  uid?: number
  region?: ZZZRegion
}

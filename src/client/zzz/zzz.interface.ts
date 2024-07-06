import { IHoyolabOptions } from '../hoyolab'

export enum ZZZRegion {
  USA = 'prod_gf_us',
  EUROPE = 'prod_gf_eu',
  ASIA = 'prod_gf_jp',
  CHINA_TAIWAN = 'prod_gf_sg',
}

export type ZZZRegionKeyType = keyof typeof ZZZRegion

export interface IZZZOptions extends IHoyolabOptions {
  uid?: number
  region?: ZZZRegion
}

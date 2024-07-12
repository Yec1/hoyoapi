import { HoyoAPIError } from '../../error'
import { ZZZRegion, ZZZRegionKeyType } from './zzz.interface'

/**
 * Get Zenless Zone Zero region based on UID.
 *
 * @param uid User ID.
 * @returns Region for the UID.
 * @throws `HoyoAPIError` when the UID is invalid.
 */
export function getZZZRegion(uid: number): ZZZRegion {
  const server_region = Number(uid.toString().trim().slice(0, 2))
  let key: string

  switch (server_region) {
    case 10:
      key = 'USA'
      break
    case 15:
      key = 'EUROPE'
      break
    case 13:
      key = 'ASIA'
      break
    case 17:
      key = 'CHINA_TAIWAN'
      break
    default:
      throw new HoyoAPIError(`Given UID ${uid} is invalid !`)
  }

  return ZZZRegion[key as ZZZRegionKeyType]
}

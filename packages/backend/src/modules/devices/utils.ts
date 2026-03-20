import { isIP } from 'node:net'

import type { CreateDeviceReqBody } from './model'
import { getOrCreateFarmMetadata } from './repository'

let cachedFarmId: string

export const getAvailableIp = (device: CreateDeviceReqBody) => {
  return device.ethIp && isIP(device.ethIp)
    ? device.ethIp
    : device.wlanIp && isIP(device.wlanIp)
      ? device.wlanIp
      : undefined
}

export const getDbFingerprint = async (): Promise<string> => {
  if (cachedFarmId) {
    return cachedFarmId
  }
  cachedFarmId = await getOrCreateFarmMetadata()
  return cachedFarmId
}

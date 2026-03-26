import { isIP } from 'node:net'

import { AxiosError } from 'axios'

import { HttpApi } from '@/api/snapmaker'
import { getOrCreateFarm } from '@/modules/farms/repository'

import { BINDING_FILENAME } from './constants'
import type { CreateDeviceReqBody } from './model'

export type BindingStatus = 'unbound' | 'bound_self' | 'bound_other'

export interface BindingCheckResult {
  status: BindingStatus
  fingerprint: string | null
}

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
  cachedFarmId = (await getOrCreateFarm()).id
  return cachedFarmId
}

export const checkBindingStatus = async (ip: string): Promise<BindingCheckResult> => {
  const farmFingerprint = await getDbFingerprint()
  try {
    const deviceFingerprint = (
      await new HttpApi(ip).downloadFile('config', BINDING_FILENAME)
    ).trim()
    return {
      status: deviceFingerprint === farmFingerprint ? 'bound_self' : 'bound_other',
      fingerprint: deviceFingerprint,
    }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return { status: 'unbound', fingerprint: null }
    }
    throw error
  }
}

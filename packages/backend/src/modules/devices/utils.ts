import { isIP } from 'node:net'

import { AxiosError } from 'axios'

import { HttpApi } from '@/api/snapmaker'
import { getOrCreateFarm } from '@/modules/farms/exports'

import { BINDING_FILENAME } from './constants'
import type { CreateDeviceReqBody, DeviceSelectSchema } from './model'

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
/**
 * Enrich a device record with live device info and print status fetched from the device API.
 * Returns the original device record as-is if no reachable IP is available.
 */
export const enrichDeviceInfo = async (device: DeviceSelectSchema) => {
  const ip = getAvailableIp(device)
  if (!ip) {
    return device
  }
  const httpApi = new HttpApi(ip)
  const printerInfo = await httpApi.getPrinterInfo()
  const printerObjects = await httpApi.getPrinterObjects({
    print_stats: null,
    display_status: ['progress'],
  })
  const productInfo = (await httpApi.getSystemInfo()).result.system_info.product_info
  return {
    ...device,
    deviceInfo: {
      name: productInfo.device_name,
      nozzleDiameters: productInfo.nozzle_diameter,
      state: printerInfo.result.state,
      configFile: printerInfo.result.config_file,
      softwareVersion: printerInfo.result.software_version,
    },
    printInfo: {
      state: printerObjects.result.status.print_stats.state,
      filename: printerObjects.result.status.print_stats.filename,
      duration: {
        current: printerObjects.result.status.print_stats.print_duration,
        total: printerObjects.result.status.print_stats.total_duration,
      },
      filamentUsed: printerObjects.result.status.print_stats.filament_used,
      message: printerObjects.result.status.print_stats.message,
      layerCount: {
        current: printerObjects.result.status.print_stats.info.current_layer,
        total: printerObjects.result.status.print_stats.info.total_layer,
      },
      progress: printerObjects.result.status.display_status.progress,
    },
  }
}

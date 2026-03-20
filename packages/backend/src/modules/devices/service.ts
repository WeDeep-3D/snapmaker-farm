import { AxiosError } from 'axios'
import { Elysia } from 'elysia'

import { HttpApi } from '@/api/snapmaker'
import { KlippyState } from '@/api/snapmaker/types'
import { log } from '@/log'
import { buildErrorResponse, buildSuccessResponse } from '@/utils/common'
import { packToZipStream } from '@/utils/io'

import { BINDING_FILENAME } from './constants'
import type { CreateDeviceReqBody } from './model'
import {
  deleteDevice,
  getAllDevices,
  getDeviceById,
  getDevicesByRegionId,
  upsertDevice,
} from './repository'
import { getAvailableIp, getDbFingerprint } from './utils'

export abstract class Devices {
  static async getDevices(regionId?: string) {
    const deviceList = regionId ? await getDevicesByRegionId(regionId) : await getAllDevices()
    return buildSuccessResponse(
      await Promise.all(
        deviceList.map(async (device) => {
          const ip = getAvailableIp(device)
          const printerInfo = ip ? await new HttpApi(ip).getPrinterInfo() : undefined
          return {
            ...device,
            printerInfo: {
              state: printerInfo?.result.state ?? KlippyState.unknown,
              logFile: printerInfo?.result.log_file ?? '',
              configFile: printerInfo?.result.config_file ?? '',
              softwareVersion: printerInfo?.result.software_version ?? '',
            },
          }
        }),
      ),
    )
  }

  static async createDevice(body: CreateDeviceReqBody, force = false) {
    const ip = getAvailableIp(body)
    if (!ip) {
      return buildErrorResponse(400, 'No valid IP address provided in ethIp or wlanIp')
    }
    const api = new HttpApi(ip)
    const fingerprint = await getDbFingerprint()

    let existingFingerprint: string | null = null
    let needsUpload = true
    try {
      existingFingerprint = (await api.downloadFile('config', BINDING_FILENAME)).trim()
      if (existingFingerprint === fingerprint) {
        needsUpload = false
      } else if (!force) {
        return buildErrorResponse(
          409,
          `Device at IP ${ip} is already bound to another backend (fingerprint: ${existingFingerprint})`,
        )
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        // File doesn't exist, will create it below
      } else {
        return buildErrorResponse(500, `Failed to check binding file: ${(error as Error).message}`)
      }
    }

    if (needsUpload) {
      try {
        await api.uploadFile('config', BINDING_FILENAME, fingerprint)
      } catch (error) {
        return buildErrorResponse(500, `Failed to upload binding file: ${(error as Error).message}`)
      }
    }

    try {
      const upsertedDevice = await upsertDevice(body)
      if (!upsertedDevice) {
        // Rollback binding file if DB operation fails
        if (needsUpload && existingFingerprint) {
          try {
            await api.uploadFile('config', BINDING_FILENAME, existingFingerprint)
          } catch (rollbackError) {
            log.error(
              rollbackError,
              `Failed to rollback binding file after DB error for device at IP ${ip}`,
            )
          }
        }
        return buildErrorResponse(500, 'Failed to upsert device in database')
      }
      return buildSuccessResponse()
    } catch (error) {
      log.error(error, 'Database error while binding device')
      return buildErrorResponse(500, 'Database error while binding device')
    }
  }

  static async removeDevice(id: string) {
    const device = await getDeviceById(id)
    if (!device) {
      return buildErrorResponse(404, `Device with ID ${id} not found`)
    }

    const ip = getAvailableIp(device)
    let oldFingerprint: string | null = null
    if (ip) {
      const api = new HttpApi(ip)
      try {
        oldFingerprint = (await api.downloadFile('config', BINDING_FILENAME)).trim()
        await api.deleteFile('config', BINDING_FILENAME)
      } catch (error) {
        if (
          error instanceof AxiosError &&
          (error.response?.status === 400 || error.response?.status === 404)
        ) {
          // Binding file already absent, proceed
        } else {
          return buildErrorResponse(
            500,
            `Failed to delete binding file from device at IP ${ip}: ${(error as Error).message}`,
          )
        }
      }
    }

    const deleted = await deleteDevice(id)
    if (!deleted) {
      // Restore binding file if DB deletion fails
      if (ip && oldFingerprint) {
        try {
          await new HttpApi(ip).uploadFile('config', BINDING_FILENAME, oldFingerprint)
        } catch (rollbackError) {
          log.error(
            rollbackError,
            `Failed to restore binding file after DB deletion error for device at IP ${ip}`,
          )
        }
      }
      return buildErrorResponse(500, 'Failed to delete device from database')
    }

    return buildSuccessResponse()
  }

  static async downloadLogs(id: string) {
    const device = await getDeviceById(id)
    if (!device) {
      return buildErrorResponse(404, `Device with ID ${id} not found`)
    }
    const ip = getAvailableIp(device)
    if (!ip) {
      return buildErrorResponse(400, 'No valid IP address found for the device')
    }
    const api = new HttpApi(ip)
    const { result: fileList } = await api.listAvailableFiles('logs')
    const files = await Promise.all(
      fileList.map(async (fileData) => ({
        name: fileData.path,
        lastModified: fileData.modified,
        input: await api.downloadFile('logs', fileData.path),
      })),
    )
    return new Response(packToZipStream(files), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${ip}_logs.zip"`,
        'Cache-Control': 'no-cache',
      },
    })
  }
}

export const devicesService = new Elysia({ name: 'devices.service' }).onStart(async () => {
  const allDevices = await getAllDevices()
  log.debug({ allDevices }, 'Try connecting to all devices on startup')
})

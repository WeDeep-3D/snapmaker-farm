import axios, { type AxiosInstance } from 'axios'

import type {
  DeleteFileResp,
  GetMoonrakerInfoResp,
  GetPrinterInfoResp,
  GetPrinterObjectsResp,
  GetSystemInfoResp,
  ListAvailableFilesResp,
  ListRegisteredRootsResp,
  PrinterObjectQuery,
} from './types'

export class HttpApi {
  private readonly _api: AxiosInstance

  constructor(ip: string) {
    // noinspection HttpUrlsUsage
    this._api = axios.create({ adapter: 'fetch', baseURL: `http://${ip}:7125` })
  }

  async getMoonrakerInfo() {
    return (await this._api.get<GetMoonrakerInfoResp>('/server/info')).data
  }

  async getPrinterInfo() {
    return (await this._api.get<GetPrinterInfoResp>('/printer/info')).data
  }

  async getPrinterObjects<const T extends PrinterObjectQuery>(objects: T) {
    return (await this._api.post<GetPrinterObjectsResp<T>>('/printer/objects/query', { objects }))
      .data
  }

  async getSystemInfo(): Promise<GetSystemInfoResp> {
    return (await this._api.get<GetSystemInfoResp>('/machine/system_info')).data
  }

  async listAvailableFiles(root: string) {
    return (
      await this._api.get<ListAvailableFilesResp>('/server/files/list', {
        params: { root },
      })
    ).data
  }

  async listRegisteredRoots() {
    return (await this._api.get<ListRegisteredRootsResp>('/server/files/roots')).data
  }

  async downloadFile(root: string, filename: string) {
    return (
      await this._api.get<string>(`/server/files/${root}/${filename}`, {
        responseType: 'text',
      })
    ).data
  }

  async uploadFile(root: string, filename: string, content: string) {
    const formData = new FormData()
    const file = new File([content], filename, { type: 'application/octet-stream' })
    formData.append('file', file)
    formData.append('root', root)
    await this._api.post('/server/files/upload', formData, {
      headers: { 'Content-Type': null },
    })
  }

  async deleteFile(root: string, filename: string) {
    return (await this._api.delete<DeleteFileResp>(`/server/files/${root}/${filename}`)).data
  }
}

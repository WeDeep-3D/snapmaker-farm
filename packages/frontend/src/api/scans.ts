import { api } from 'boot/axios';

export interface ErrorRespBody {
  success: false;
  message: string;
}

export type CreateScanRespBody = ErrorRespBody | { success: true; data: string };

export interface ScanDetail {
  id: string;
  processingCount: number;
  queuedCount: number;
  recognized: {
    ip: string;
    model: string;
    name: string;
    serialNumber: string;
    version: string;
    network?: {
      type: 'wired' | 'wireless' | 'unknown';
      macAddress: string;
    };
  }[];
  totalCount: number;
}

export type GetScanRespBody =
  | ErrorRespBody
  | {
      success: true;
      data: ScanDetail;
    };

export const createScan = async (ipRanges: { begin: string; end: string }[]) =>
  await api.post<CreateScanRespBody>('scans', ipRanges);

export const getScan = async (scanId: string) => await api.get<GetScanRespBody>(`scans/${scanId}`);

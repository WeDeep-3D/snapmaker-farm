import type { GetScanRespBody } from '@/modules/scans/model';

export type ScanDetail = NonNullable<GetScanRespBody['data']>;

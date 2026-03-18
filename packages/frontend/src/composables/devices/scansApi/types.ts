import type { app } from 'boot/eden';
import type { Treaty } from '@elysiajs/eden';

export type ScanDetail = Treaty.Data<ReturnType<typeof app.api.v1.scans>['get']>['data'];
export type DeviceInfo = NonNullable<ScanDetail>['recognized'][number];

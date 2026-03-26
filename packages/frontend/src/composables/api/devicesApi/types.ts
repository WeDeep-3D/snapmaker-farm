import type { Treaty } from '@elysiajs/eden';

import type { app } from 'boot/eden';

export type Device = NonNullable<Treaty.Data<typeof app.api.v1.devices.get>['data']>[number];
export type CreateDeviceBody = Parameters<typeof app.api.v1.devices.post>[0];

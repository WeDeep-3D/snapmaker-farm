import type { Treaty } from '@elysiajs/eden';

import type { app } from 'boot/eden';

export type Farm = Treaty.Data<typeof app.api.v1.farms.get>['data'];

import type { Treaty } from '@elysiajs/eden';

import type { app } from 'boot/eden';

export type Region = Treaty.Data<typeof app.api.v1.regions.post>['data'];

import { treaty } from '@elysiajs/eden';

import type { App } from '@/index';

const baseUrl = process.env.HTTP_BASE_URL ?? (process.env.DEV ? 'http://localhost:3000' : '');

export const app = treaty<App>(baseUrl);

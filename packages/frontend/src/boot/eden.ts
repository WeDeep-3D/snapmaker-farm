import { treaty } from '@elysiajs/eden';

import type { App } from '@/index';

const baseUrl = process.env.HTTP_BASE_URL ?? (process.env.DEV ? 'http://localhost:3000' : '');

console.log('HTTP_BASE_URL', baseUrl);

export const app = treaty<App>(baseUrl);

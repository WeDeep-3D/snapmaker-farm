import { Elysia, t } from 'elysia'
import cors from '@elysiajs/cors'
import { fromTypes, openapi } from '@elysiajs/openapi'
import staticPlugin from '@elysiajs/static'
import { env } from '@yolk-oss/elysia-env'
import { resolve } from 'node:path'

import packageJson from 'package.json'
import { log } from '@/log'
import { devices } from '@/modules/devices'
import { plates } from '@/modules/plates'
import { projects } from '@/modules/projects'
import { regions } from '@/modules/regions'
import { scans } from '@/modules/scans'

const staticFilesPrefix = '/public'
const indexHtmlPath = resolve('public', 'index.html')

const app = new Elysia()
  .use(log.into())
  .use(
    env({
      DATABASE_URL: t.String({
        format: 'uri',
        description: 'Database connection URL',
      }),
    }),
  )
  .use(
    openapi({
      documentation: {
        info: {
          title: 'Snapmaker Farm API',
          version: packageJson.version,
          description:
            'This is the API documentation for Snapmaker Farm, ' +
            'a management system for Snapmaker 3D printers and devices.',
        },
      },
      exclude: {
        paths: [`${staticFilesPrefix}/*`],
      },
      references: fromTypes(
        process.env.NODE_ENV === 'production' ? 'dist/index.d.ts' : 'src/index.ts',
      ),
    }),
  )
  .use(
    staticPlugin({
      prefix: staticFilesPrefix,
      // Use regex patterns instead of strings to work around an
      // @elysiajs/static v1.4.7 bug: shouldIgnore() checks
      // pattern.includes(file) instead of file.includes(pattern),
      // so string patterns never match. Regex uses pattern.test(file)
      // which works correctly.
      // Exclude .html files to prevent Bun's HTML bundler
      // (await import()) from breaking absolute asset paths in the
      // built frontend output.
      ignorePatterns: [/\.DS_Store/, /\.git/, /\.env/, /\.html$/],
    }),
  )
  // Serve index.html as a raw file via Bun.file() to bypass Bun's HTML
  // bundler. This is the root cause fix for path resolution errors when
  // embedding the frontend build output in the backend.
  .get(`${staticFilesPrefix}/index.html`, () => new Response(Bun.file(indexHtmlPath)))
  .get(staticFilesPrefix, () => new Response(Bun.file(indexHtmlPath)))
  .use(cors())
  .use(regions)
  .use(devices)
  .use(plates)
  .use(projects)
  .use(scans)
  .onError((ctx) => {
    ctx.log?.error(ctx, ctx.error.toString())
    return 'onError'
  })
  .listen(3000)

export type App = typeof app

log.info(`🦊 ElysiaJS is running at ${app.server?.url}`)
log.info(`⚡️ Check OpenAPI docs at ${app.server?.url}openapi`)

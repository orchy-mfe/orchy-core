import {join} from 'desm'
import fastify from 'fastify'
import now from 'fastify-now'

import config from './plugins/config.js'

export const buildServer = async () => {
  const server = fastify({
    ajv: {
      customOptions: {
        removeAdditional: 'all',
        coerceTypes: true,
        useDefaults: true,
      }
    },
    logger: {
      level: process.env.LOG_LEVEL,
    },
  })

  await server.register(config)
  await server.register(now, {
    routesFolder: join(import.meta.url, 'routes'),
  })
  await server.ready()

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () =>
      server.close().then((err) => {
        console.log(`close application on ${signal}`)
        process.exit(err ? 1 : 0)
      }),
    )
  }

  return server
}
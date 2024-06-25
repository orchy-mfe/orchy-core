import fastify from 'fastify'

import config from './plugins/config.js'
import configurationFile from './routes/api/v1/configuration/_configurationFile.js'

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
  await server.register(configurationFile, {prefix: '/api/v1/configuration'})
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
import tap from 'tap'
import { FastifyInstance } from 'fastify/types/instance'

import { buildServer } from '../server.js'

tap.test('GET /', async t => {
  t.plan(1)

  process.env.CONFIG_PATH = '/'
  const fastify: FastifyInstance = await buildServer()

  t.teardown(async () => {
    await fastify.close()
  })

  t.test('Should return hello world', async (t) => {
    t.plan(2)

    const response = await fastify.inject({
      method: 'GET',
      path: '/',
    })
    t.match(response.statusCode, 200)
    t.match(response.json(), { hello: 'world' })
  })
})

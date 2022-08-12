import tap from 'tap'
import path from 'path'

import { FastifyInstance } from 'fastify/types/instance'

import { buildServer } from '../../../../server.js'
import orchyConfigContent from '../../../../testConfig/orchy-config.json' assert {type: "json"}

tap.test('GET /', async t => {
    t.plan(1)

    process.env.CONFIG_PATH = path.join(import.meta.url.replace("file:", ""), '../../../../../testConfig')
    const fastify: FastifyInstance = await buildServer()

    t.teardown(async () => {
        await fastify.close()
    })

    t.test('Should return orchy-config.json file', async (t) => {
        t.plan(2)

        const response = await fastify.inject({
            method: 'GET',
            path: '/api/v1/configuration/orchy-config.json',
        })

        t.equal(response.statusCode, 200)
        t.strictSame(JSON.parse(response.body), orchyConfigContent)
    })
})

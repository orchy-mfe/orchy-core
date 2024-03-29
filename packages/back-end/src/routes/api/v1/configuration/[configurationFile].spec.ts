import {join} from 'desm'
import {FastifyInstance} from 'fastify/types/instance'
import tap from 'tap'

import {buildServer} from '../../../../server.js'
import orchyConfigContent from '../../../../testConfig/orchy-config.json' assert { type: 'json' }

tap.test('GET /', async t => {
    process.env.CONFIG_PATH = join(import.meta.url, '..', '..', '..', '..', 'testConfig')
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

    t.test('Should return 500 for not existing file', async (t) => {
        t.plan(1)

        const response = await fastify.inject({
            method: 'GET',
            path: '/api/v1/configuration/not-existing-file.json',
        })

        t.equal(response.statusCode, 404)
    })

    t.end()
})

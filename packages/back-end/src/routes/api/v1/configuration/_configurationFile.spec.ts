import {join} from 'desm'
import {FastifyInstance} from 'fastify/types/instance'
import {afterAll, describe, expect, test} from 'vitest'

import {buildServer} from '../../../../server'
import orchyConfigContent from '../../../../testConfig/orchy-config.json'

describe('GET /', async () => {
    process.env.CONFIG_PATH = join(import.meta.url, '..', '..', '..', '..', 'testConfig')
    const fastify: FastifyInstance = await buildServer()

    afterAll(() => fastify.close())

    test('Should return orchy-config.json file', async () => {
        const response = await fastify.inject({
            method: 'GET',
            path: '/api/v1/configuration/orchy-config.json',
        })

        expect(response.statusCode).toBe(200)
        expect(response.json()).toStrictEqual(orchyConfigContent)
    })

    test('Should return 500 for not existing file', async () => {
        const response = await fastify.inject({
            method: 'GET',
            path: '/api/v1/configuration/not-existing-file.json',
        })

        expect(response.statusCode).toBe(404)
    })
})

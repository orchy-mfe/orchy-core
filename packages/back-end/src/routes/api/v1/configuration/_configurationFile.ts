import {Type} from '@sinclair/typebox'
import {FastifyInstance, FastifyRequest} from 'fastify'
import fs from 'fs'
import path from 'path'

import {Config} from '../../../../plugins/config.js'

type FastifyTypedRequest = { Params: { configurationFile: string } }

const retrieveConfigPath = (request: FastifyRequest<FastifyTypedRequest>, config: Config) => {
    const {configurationFile} = request.params
    return path.join(config.CONFIG_PATH, configurationFile)
}

const fileExistsAsync = (configPath: string) => fs.promises.access(configPath).then(() => true).catch(() => false)

export default async function configurationFile(fastify: FastifyInstance) {
    fastify.get<FastifyTypedRequest>('/:configurationFile', {
        schema: {
            params: Type.Object({
                configurationFile: Type.String()
            }, {
                required: ['configurationFile']
            }),
            response: {
                200: Type.Any()
            }
        }
    }, async (request, reply) => {
        const configPath = retrieveConfigPath(request, fastify.config)
        const fileExists = await fileExistsAsync(configPath)

        if (!fileExists)
            reply.status(404).send()
        else
            reply.send(await fs.promises.readFile(configPath))
    })
}

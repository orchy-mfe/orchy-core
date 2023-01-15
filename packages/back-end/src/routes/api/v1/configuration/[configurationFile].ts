import {Type} from '@sinclair/typebox'
import {FastifyRequest} from 'fastify'
import {NowRequestHandler} from 'fastify-now'
import fs from 'fs'
import path from 'path'

import {Config} from '../../../../plugins/config.js'

type FastifyTypedRequest = { Params: { configurationFile: string } }

const retrieveConfigPath = (request: FastifyRequest<FastifyTypedRequest>, config: Config) => {
    const {configurationFile} = request.params
    return path.join(config.CONFIG_PATH, configurationFile)
}

const fileExistsAsync = (configPath: string) => fs.promises.access(configPath).then(() => true).catch(() => false)

export const GET: NowRequestHandler<FastifyTypedRequest> = async function (request, response) {
    const configPath = retrieveConfigPath(request, this.config)
    const fileExists = await fileExistsAsync(configPath)

    if(!fileExists)
        response.status(404).send()
    else
        response.send(await fs.promises.readFile(configPath))
}

GET.opts = {
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
}

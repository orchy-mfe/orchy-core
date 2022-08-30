import {NowRequestHandler} from 'fastify-now'
import {Type} from '@sinclair/typebox'
import fs from 'fs'
import {FastifyRequest} from 'fastify'
import path from 'path'

import {Config} from '../../../../plugins/config.js'

type FastifyTypedRequest = { Params: { configurationFile: string } }

const retrieveConfig = async (configurationPath: string) => {
    const fileContent = await fs.promises.readFile(configurationPath)
    return fileContent.toString()
}

const retrieveConfigPath = (request: FastifyRequest<FastifyTypedRequest>, config: Config) => {
    const {configurationFile} = request.params
    return path.join(config.CONFIG_PATH, configurationFile)
}

export const GET: NowRequestHandler<FastifyTypedRequest> = async function (request, response) {
    const configPath = retrieveConfigPath(request, this.config)
    const configContent = await retrieveConfig(configPath)
    response.send(configContent)
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

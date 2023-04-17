import {Configuration, PageConfiguration} from '@orchy-mfe/models'
import {FastifyPluginAsync, FastifyReply, FastifyRequest} from 'fastify'
import fp from 'fastify-plugin'
import fs from 'fs'
import {join} from 'path'

const assertConfigurationExists = (configPath: string) => {
    if(!fs.existsSync(configPath)) {
        throw new Error(`Configuration at path ${configPath} does not exist`)
    }
}

const retrieveConfiguration = async (configurationPath: string) => {
    const configurationContent = await fs.promises.readFile(configurationPath, 'utf8')

    return JSON.parse(configurationContent)
}

const renderConfiguration = (configuration: Configuration, pageConfiguration: PageConfiguration) => {
    return (request: FastifyRequest, reply: FastifyReply) => {
    }
}


const orchyRoutes: FastifyPluginAsync = async server => {
    const configPath = join(server.config.CONFIG_PATH, server.config.SSR_CONFIG_NAME)
    assertConfigurationExists(configPath)

    const configurationContent: Configuration = await retrieveConfiguration(configPath)

    Object.entries(configurationContent.microPages).forEach(async ([route, routeConfiguration]) => {
        const pageConfigurationPath = join(server.config.CONFIG_PATH, routeConfiguration.pageConfiguration)
        assertConfigurationExists(pageConfigurationPath)

        const microPageConfiguration = await retrieveConfiguration(pageConfigurationPath)

        server.get(`${route}/*`, renderConfiguration(configurationContent, microPageConfiguration))
    })

}

export default fp(orchyRoutes)
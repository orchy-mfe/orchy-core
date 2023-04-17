import {GlobalRegistrator} from '@happy-dom/global-registrator'
import {Configuration, MicroPage, PageConfiguration} from '@orchy-mfe/models'
import PageBuilder from '@orchy-mfe/page-builder'
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

const createStylesheetConfiguration = (stylesheetUrl: string): PageConfiguration => ({
    type: 'element',
    tag: 'link',
    attributes: {
        rel: 'stylesheet',
        href: stylesheetUrl
    }
})

const renderConfiguration = (configuration: Configuration, microPage: MicroPage, pageConfiguration: PageConfiguration) => {
    const stylesConfiguration: Array<PageConfiguration | string> = configuration.common?.stylesheets?.map(createStylesheetConfiguration) || []
    const fullPageConfiguration = stylesConfiguration.concat(pageConfiguration)


    return (request: FastifyRequest, reply: FastifyReply) => {
        const orchyProps = {
            ...microPage.properties,
            basePath: new URL(request.url, request.headers.host).pathname,
        }

        const pageElement = PageBuilder.pageBuilder(fullPageConfiguration, undefined, orchyProps)

        reply.header('Content-Type', 'text/html')
        reply.send(pageElement.outerHTML)
    }
}


const orchyRoutes: FastifyPluginAsync = async server => {
    GlobalRegistrator.register()

    const configPath = join(server.config.CONFIG_PATH, server.config.SSR_CONFIG_NAME)
    assertConfigurationExists(configPath)

    const configurationContent: Configuration = await retrieveConfiguration(configPath)

    Object.entries(configurationContent.microPages).forEach(async ([route, microPage]) => {
        const pageConfigurationPath = join(server.config.CONFIG_PATH, microPage.pageConfiguration)
        assertConfigurationExists(pageConfigurationPath)

        const microPageConfiguration = await retrieveConfiguration(pageConfigurationPath)

        server.get(`${route}/*`, renderConfiguration(configurationContent, microPage, microPageConfiguration))
    })

    server.addHook('onClose', () => {
        GlobalRegistrator.unregister()
    })

}

export default fp(orchyRoutes)
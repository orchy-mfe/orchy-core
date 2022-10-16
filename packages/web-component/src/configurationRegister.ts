import {MicroPage, Configuration, MicroFrontend, PageConfiguration} from '@orchy-mfe/models'
import {pageBuilder} from '@orchy-mfe/page-builder'
import {ObjectType, LoadableApp, loadMicroApp, prefetchApps, FrameworkConfiguration} from 'qiankun'
import {lightJoin} from 'light-join'

import ConfigurationClient from './configuration-client/configurationClient'
import installImportMaps from './importMap'
import pageContentManagerBuilder from './pageContentManager'
import WebComponentState from './web-component-state'

type ConfigurationDependency = { content: Configuration, client: ConfigurationClient }

const defaultContainer = 'orchy-root'

const singleMfeConfigurationPromise: Promise<PageConfiguration> = Promise.resolve({
    type: 'element',
    tag: 'div',
    attributes: {
        id: defaultContainer
    }
})

const throwError = (microFrontend: MicroFrontend) => {
    throw new Error(`Invalid container configuration for application id ${microFrontend.id}`)
}

const microFrontendMapper = (route: string, microPage: MicroPage, webComponentState: WebComponentState): LoadableApp<ObjectType>[] => {
    const container = microPage.microFrontends.length == 1 ? `#${defaultContainer}` : undefined

    return microPage.microFrontends.map((microFrontend: MicroFrontend) => ({
        name: microFrontend.id,
        entry: microFrontend.entryPoint,
        container: microFrontend.container || container || throwError(microFrontend),
        props: {
            ...microPage.properties,
            ...microFrontend.properties,
            baseUrl: lightJoin(webComponentState.router.root, route),
            eventBus: webComponentState.eventBus
        }
    }))
}

const microFrontendsLoader = async (mappedMicroFrontends: LoadableApp<ObjectType>[], qiankunConfiguration: FrameworkConfiguration) => {
    const loadedMicroApps = []
    for (const microFrontend of mappedMicroFrontends) {
        const loadedMicroApp = loadMicroApp(microFrontend, qiankunConfiguration)
        await loadedMicroApp?.mountPromise.catch(console.error)
        loadedMicroApps.push(loadedMicroApp)
    }
    return loadedMicroApps
}

const createStylesheetConfiguration = (stylesheetUrl: string): PageConfiguration => ({
    type: 'element',
    tag: 'link',
    attributes: {
        rel: 'stylesheet',
        href: stylesheetUrl
    }
})

const registerRoutes = (configuration: ConfigurationDependency, webComponentState: WebComponentState) => {
    const stylesConfiguration = configuration.content.common?.stylesheets?.map(createStylesheetConfiguration) || []
    const pageContentManager = pageContentManagerBuilder(webComponentState)
    const qiankunConfiguration = installImportMaps(configuration.content) || {}
    let lastManagedRoute = ''

    return ([route, microPage]: [string, MicroPage]) => {
        const mappedMicroFrontends = microFrontendMapper(route, microPage, webComponentState)
        prefetchApps(mappedMicroFrontends, qiankunConfiguration)
        const routeToManage = lightJoin(route, '*')
        webComponentState.router.on(routeToManage, async () => {
            if(lastManagedRoute === routeToManage) return

            lastManagedRoute = routeToManage
            configuration.client.abortRetrieve()
    
            const pageConfigurationPromise = microPage.pageConfiguration ? configuration.client.retrieveConfiguration<PageConfiguration>(microPage.pageConfiguration) : singleMfeConfigurationPromise

            const pageConfiguration = stylesConfiguration.concat(await pageConfigurationPromise)
            const pageElement = pageBuilder(pageConfiguration)
            pageContentManager(pageElement)
            
            webComponentState.eventBus.clearBuffer()
            webComponentState.setLoadedMicroFrontends(await microFrontendsLoader(mappedMicroFrontends, qiankunConfiguration))
        }, {
            leave: (done) => {
                webComponentState.routeLeave()
                done()
            }
        })
    }
}

const configurationRegister = (configuration: ConfigurationDependency, webComponentState: WebComponentState) => {        
    const routesRegister = registerRoutes(configuration, webComponentState)
    Object.entries(configuration.content.microPages).forEach(routesRegister)

    webComponentState.router.resolve()
}

export default configurationRegister
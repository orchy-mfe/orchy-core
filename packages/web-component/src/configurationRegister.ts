import {MicroPage, Configuration, MicroFrontend, PageConfiguration} from '@orchy-mfe/models'
import {pageBuilder} from '@orchy-mfe/page-builder'
import Navigo from 'navigo'
import {ObjectType, LoadableApp, loadMicroApp, start} from 'qiankun'
import {lightJoin} from 'light-join'

import ConfigurationClient from './configuration-client/configurationClient'
import EventBusSubject from './event-bus/EventBusSubject'
import installImportMaps from './importMap'

type ConfigurationDependency = { content: Configuration, client: ConfigurationClient }
type setPageContent = (htmlElement: HTMLElement) => void

const defaultContainer = 'root'

const singleMfeConfigurationPromise: Promise<PageConfiguration> = Promise.resolve({
    type: 'element',
    tag: 'div',
    attributes: {
        id: defaultContainer
    }
})

const eventBus = new EventBusSubject()

const throwError = (microFrontend: MicroFrontend) => {
    throw new Error(`Invalid container configuration for application id ${microFrontend.id}`)
}

const microFrontendMapper = (route: string, microPage: MicroPage, router: Navigo): LoadableApp<ObjectType>[] => {
    const container = microPage.microFrontends.length == 1 ? `#${defaultContainer}` : undefined

    return microPage.microFrontends.map((microFrontend: MicroFrontend) => ({
        name: microFrontend.id,
        entry: microFrontend.entryPoint,
        container: container || microFrontend.container || throwError(microFrontend),
        props: {
            ...microFrontend.properties,
            ...microFrontend.properties,
            baseUrl: lightJoin(router.root, route),
            eventBus
        }
    }))
}

const microFrontendLoaderBuilder = (mappedMicroFrontends: LoadableApp<ObjectType>[]) => async () => {
    for (const microFrontend of mappedMicroFrontends) {
        const safeMountPromise = loadMicroApp(microFrontend)?.mountPromise.catch(console.error)
        await safeMountPromise
    }
}

const createStylesheetConfiguration = (stylesheetUrl: string): PageConfiguration => ({
    type: 'element',
    tag: 'link',
    attributes: {
        rel: 'stylesheet',
        href: stylesheetUrl
    }
})

const registerRoutes = (configuration: ConfigurationDependency, setPageContent: setPageContent, router: Navigo) => ([route, microPage]: [string, MicroPage]) => {
    const mappedMicroFrontends = microFrontendMapper(route, microPage, router)
    const microFrontendsLoader = microFrontendLoaderBuilder(mappedMicroFrontends)
    const stylesConfiguration = configuration.content.common?.stylesheets?.map(createStylesheetConfiguration) || []
    router.on(route, () => {
        configuration.client.abortRetrieve()

        const configurationPromise = microPage.pageConfiguration ?
        configuration.client.retrieveConfiguration<PageConfiguration>(microPage.pageConfiguration)
            : singleMfeConfigurationPromise

        configurationPromise
            .then(pageConfiguration => pageBuilder(stylesConfiguration.concat(pageConfiguration)))
            .then(setPageContent)
            .then(() => eventBus.clearBuffer())
            .then(microFrontendsLoader)
    })
}

const configurationRegister = (configuration: ConfigurationDependency, router: Navigo, setPageContent: setPageContent) => {
    start(installImportMaps(configuration.content))
        
    const routesRegister = registerRoutes(configuration, setPageContent, router)
    Object.entries(configuration.content.microPages).forEach(routesRegister)

    router.resolve()
}

export default configurationRegister
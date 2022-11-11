import {MicroPage, Configuration, PageConfiguration} from '@orchy-mfe/models'
import {pageBuilder} from '@orchy-mfe/page-builder'
import {lightJoin} from 'light-join'

import ConfigurationClient from './configuration-client/configurationClient'
import installImportMaps from './import-map/importMap'
import pageContentManagerBuilder from './page-content-manager/pageContentManager'
import WebComponentState from './web-component-state/WebComponentState'

type ConfigurationDependency = { content: Configuration, client: ConfigurationClient }

const defaultContainer = 'orchy-root'

const singleMfeConfigurationPromise: Promise<PageConfiguration> = Promise.resolve({
    type: 'element',
    tag: 'div',
    attributes: {
        id: defaultContainer
    }
})

const buildOrchyProps = (route: string, microPage: MicroPage, webComponentState: WebComponentState) => ({
    ...microPage.properties,
    baseUrl: lightJoin(webComponentState.router.root, route),
})

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
    let lastManagedRoute = ''

    return ([route, microPage]: [string, MicroPage]) => {
        const orchyProps = buildOrchyProps(route, microPage, webComponentState)
        const routeToManage = lightJoin(route, '*')
        webComponentState.router.on(routeToManage, async () => {
            if(lastManagedRoute === routeToManage) return

            lastManagedRoute = routeToManage
            configuration.client.abortRetrieve()
    
            const pageConfigurationPromise = microPage.pageConfiguration ? configuration.client.retrieveConfiguration<PageConfiguration>(microPage.pageConfiguration) : singleMfeConfigurationPromise

            const pageConfiguration = stylesConfiguration.concat(await pageConfigurationPromise)
            const pageElement = pageBuilder(pageConfiguration, webComponentState.rootElement, webComponentState.eventBus, orchyProps)
            pageContentManager(pageElement)
            
            webComponentState.eventBus.clearBuffer()
        })
    }
}

const configurationRegister = (configuration: ConfigurationDependency, webComponentState: WebComponentState) => {     
    installImportMaps(configuration.content)   
    const routesRegister = registerRoutes(configuration, webComponentState)
    Object.entries(configuration.content.microPages).forEach(routesRegister)

    webComponentState.router.resolve()
}

export default configurationRegister
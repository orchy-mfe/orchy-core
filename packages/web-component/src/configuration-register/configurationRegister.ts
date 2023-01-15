import {Configuration, MicroPage, PageConfiguration} from '@orchy-mfe/models'
import {pageBuilder} from '@orchy-mfe/page-builder'
import {lightJoin} from 'light-join'

import ConfigurationClient from '../configuration-client/configurationClient'
import installImportMaps from '../import-map/importMap'
import pageContentManagerBuilder from '../page-content-manager/pageContentManager'
import WebComponentState from '../web-component-state/WebComponentState'

type ConfigurationDependency = { content: Configuration, client: ConfigurationClient }

const buildOrchyProps = (route: string, microPage: MicroPage, webComponentState: WebComponentState) => ({
    ...microPage.properties,
    eventBus: webComponentState.eventBus,
    basePath: lightJoin(webComponentState.router.root, route),
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
    const stylesConfiguration: Array<PageConfiguration | string> = configuration.content.common?.stylesheets?.map(createStylesheetConfiguration) || []
    const pageContentManager = pageContentManagerBuilder(webComponentState)
    let lastManagedRoute = ''

    return ([route, microPage]: [string, MicroPage]) => {
        const orchyProps = buildOrchyProps(route, microPage, webComponentState)
        const routeToManage = lightJoin(route, '*')
        webComponentState.router.on(routeToManage, async () => {
            if(lastManagedRoute === routeToManage) return

            lastManagedRoute = routeToManage
            configuration.client.abortRetrieve()
    
            const pageConfiguration = await configuration.client.retrieveConfiguration<PageConfiguration>(microPage.pageConfiguration)

            const fullPageConfiguration = stylesConfiguration.concat(pageConfiguration)
            const pageElement = pageBuilder(fullPageConfiguration, webComponentState.rootElement, orchyProps)
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
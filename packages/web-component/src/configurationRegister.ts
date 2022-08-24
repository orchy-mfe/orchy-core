import { Application, Configuration, MicroFrontend, PageConfiguration } from '@orchy/models'
import {pageBuilder} from '@orchy/page-builder'
import Navigo from 'navigo'
import { ObjectType, LoadableApp, loadMicroApp } from 'qiankun'
import ConfigurationClient from './configuration-client/configurationClient'

type ConfigurationDependency = { content: Configuration, client: ConfigurationClient }
type setPageContent = (htmlElement: HTMLElement) => void

const defaultContainer = "root"

const singleMfeConfigurationPromise: Promise<PageConfiguration> = Promise.resolve({
    type: "element",
    tag: "div",
    attributes: {
        "id": defaultContainer
    }
})

const throwError = (applications: Application) => {
    throw new Error(`Invalid container configuration for application id ${applications.id}`)
}

const microfrontendMapper = (microFrontend: MicroFrontend): LoadableApp<ObjectType>[] => {
    const container = microFrontend.applications.length == 1 ? `#${defaultContainer}` : undefined
    return microFrontend.applications.map((application: Application) => ({
        name: application.id,
        entry: application.entryPoint,
        container: application.container || container || throwError(application),
        props: {
            ...microFrontend.properties,
            ...application.properties
        }
    }))
}

const registerRoutes = (client: ConfigurationClient, setPageContent: setPageContent, router: Navigo) => ([route, microFrontend]: [string, MicroFrontend]) => {
    const mappedMicroFrontends = microfrontendMapper(microFrontend)
    router.on(route, () => {
        client.abortRetrieve()

        const configurationPromise = microFrontend.pageConfiguration ?
            client.retrieveConfiguration<PageConfiguration>(microFrontend.pageConfiguration)
            : singleMfeConfigurationPromise

        configurationPromise
            .then(pageConfiguration => pageBuilder([pageConfiguration]))
            .then(setPageContent)
            .then(() => mappedMicroFrontends.forEach(microFrontend => loadMicroApp(microFrontend)))
    })
}

const configurationRegister = (configuration: ConfigurationDependency, router: Navigo, setPageContent: setPageContent) => {
    const routesRegister = registerRoutes(configuration.client, setPageContent, router)
    Object.entries(configuration.content.microFrontends).forEach(routesRegister)

    router.resolve()
}

export default configurationRegister
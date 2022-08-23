import { Application, Configuration, MicroFrontend } from '@orchy/models'
import Navigo from 'navigo'
import { ObjectType, LoadableApp, loadMicroApp } from 'qiankun'

const throwError = (applications: Application) => {
    throw new Error(`Invalid container configuration for application id ${applications.id}`)
}

const microfrontendMapper = (microFrontend: MicroFrontend): LoadableApp<ObjectType>[] => {
    const container = microFrontend.applications.length == 1 ? '#defaultContainer' : undefined
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

const registerRoutes = (router: Navigo) => ([route, microFrontend]: [string, MicroFrontend]) => {
    const mappedMicroFrontends = microfrontendMapper(microFrontend)
    router.on(route, () => {
        mappedMicroFrontends.forEach(microFrontend => loadMicroApp(microFrontend))
    })
}

const configurationRegister = (configuration: Configuration, router: Navigo) => {
    Object.entries(configuration.microFrontends).forEach(registerRoutes(router))

    router.resolve()
}

export default configurationRegister
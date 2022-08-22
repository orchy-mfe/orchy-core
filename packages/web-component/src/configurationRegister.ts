import { Application, Configuration, MicroFrontend } from '@orchy/models'
import { registerMicroApps, start, RegistrableApp, ObjectType, FrameworkLifeCycles, LoadableApp } from 'qiankun'

const throwError = (applications: Application) => {
    throw new Error(`Invalid container configuration for application id ${applications.id}`)
}

const microfrontendMapper = ([route, microfrontend]: [string, MicroFrontend]): RegistrableApp<ObjectType>[] => {
    const container = microfrontend.applications.length == 1 ? '#defaultContainer' : undefined
    return microfrontend.applications.map((application: Application) => ({
        name: application.id,
        entry: application.entryPoint,
        activeRule: route,
        container: application.container || container || throwError(application),
        props: {
            ...microfrontend.properties,
            ...application.properties,
            pageConfiguration: microfrontend.pageConfiguration
        }
    }))
}

const lifecycles: FrameworkLifeCycles<ObjectType> = {
    beforeLoad: (app: LoadableApp<ObjectType>) => {
        console.log(app.props?.pageConfiguration)
        return Promise.resolve()
    }
}

const configurationRegister = (configuration: Configuration) => {
    const microFrontendsToRegister = Object.entries(configuration.microFrontends).flatMap(microfrontendMapper)
    registerMicroApps(microFrontendsToRegister, lifecycles)
    start()
}

export default configurationRegister
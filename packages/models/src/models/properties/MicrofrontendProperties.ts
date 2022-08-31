import {ReplaySubject} from 'rxjs'
import {Application, MicroFrontend} from '../configuration'

type MicrofrontendEventBus<T = unknown> = {
    eventBus: ReplaySubject<T>
}

export type MicrofrontendProperties<T> = MicroFrontend['properties'] & Application['properties'] & MicrofrontendEventBus<T>
import {ReplaySubject} from 'rxjs'
import {Application, MicroFrontend} from '../configuration'

type AdditionalProperties<T = unknown> = {
    eventBus: ReplaySubject<T>,
    container?: HTMLElement
}

export type MicrofrontendProperties<T> = MicroFrontend['properties'] & Application['properties'] & AdditionalProperties<T>
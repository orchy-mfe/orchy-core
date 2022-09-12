import {ReplaySubject} from 'rxjs'
import {MicroPage, MicroFrontend} from '../configuration'

type AdditionalProperties<T = unknown> = {
    eventBus: ReplaySubject<T>,
    container?: HTMLElement
}

export type MicrofrontendProperties<T> = MicroPage['properties'] & MicroFrontend['properties'] & AdditionalProperties<T>
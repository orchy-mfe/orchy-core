import {ReplaySubject} from 'rxjs'

import {MicroPage} from '../configuration'

type AdditionalProperties<E> = {
    basePath: string,
    eventBus: ReplaySubject<E>
}

export type MicroFrontendProperties<T = unknown, E=unknown> = MicroPage['properties'] & AdditionalProperties<E> & T
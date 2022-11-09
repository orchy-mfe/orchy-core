import {ElementPageConfiguration, MicroFrontendProperties} from '@orchy-mfe/models'
import {Subject} from 'rxjs'

import ElementNodeCreator from './ElementNodeCreator'

export default class MicroFrontendNodeCreator extends ElementNodeCreator {
    constructor(elementConfiguration: ElementPageConfiguration, eventBus: Subject<unknown>, microFrontendProperties: MicroFrontendProperties) {
        super({...elementConfiguration, properties: {...elementConfiguration.properties, orchyProperties: microFrontendProperties}}, eventBus)
    }
}
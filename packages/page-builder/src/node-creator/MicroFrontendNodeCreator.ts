import {ElementPageConfiguration, MicroFrontendProperties} from '@orchy-mfe/models'
import {Subject} from 'rxjs'

import ElementNodeCreator from './ElementNodeCreator'

export default class MicroFrontendNodeCreator extends ElementNodeCreator {
    constructor(elementConfiguration: ElementPageConfiguration, eventBus: Subject<unknown>, microFrontendProperties: MicroFrontendProperties) {
        const orchyProperties = {...microFrontendProperties, ...elementConfiguration.properties, eventBus}
        super({...elementConfiguration, properties: {orchyProperties}}, undefined)
    }
}
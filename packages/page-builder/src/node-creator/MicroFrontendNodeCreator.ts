import {ElementPageConfiguration, MicroFrontendProperties} from '@orchy-mfe/models'

import ElementNodeCreator from './ElementNodeCreator'

export default class MicroFrontendNodeCreator extends ElementNodeCreator {
    constructor(elementConfiguration: ElementPageConfiguration, microFrontendProperties: MicroFrontendProperties) {
        const orchyProperties = {...microFrontendProperties, ...elementConfiguration.attributes, ...elementConfiguration.properties}
        super({...elementConfiguration, properties: {orchyProperties}}, undefined)
    }
}
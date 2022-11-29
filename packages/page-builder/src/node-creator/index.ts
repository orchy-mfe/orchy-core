import {PageConfiguration, MicroFrontendProperties} from '@orchy-mfe/models'

import ElementNodeCreator from './ElementNodeCreator'
import LayoutNodeCreator from './LayoutNodeCreator'
import MicroFrontendNodeCreator from './MicroFrontendNodeCreator'

export const createNode = (configuration: PageConfiguration, microFrontendProperties: MicroFrontendProperties): HTMLElement => {
    switch (configuration.type) {
        case 'element':
            return new ElementNodeCreator(configuration, microFrontendProperties.eventBus).create()
        case 'micro-frontend':
            return new MicroFrontendNodeCreator(configuration, microFrontendProperties).create()
        case 'flex-column':
        case 'flex-row':
            return new LayoutNodeCreator(configuration).create()
    }
}
import {MicroFrontendProperties, PageConfiguration} from '@orchy-mfe/models'

import ElementNodeCreator from './ElementNodeCreator'
import LayoutNodeCreator from './LayoutNodeCreator'
import MicroFrontendNodeCreator from './MicroFrontendNodeCreator'
import SsrMicroFrontendNodeCreator from './SsrMicroFrontendNodeCreator'

export const createNode = (configuration: PageConfiguration, microFrontendProperties: MicroFrontendProperties): Promise<HTMLElement> => {
    switch (configuration.type) {
        case 'element':
            return new ElementNodeCreator(configuration, microFrontendProperties.eventBus).create()
        case 'micro-frontend':
            return new MicroFrontendNodeCreator(configuration, microFrontendProperties).create()
        case 'ssr-micro-frontend':
            return new SsrMicroFrontendNodeCreator(configuration, microFrontendProperties).create()
        case 'flex-column':
        case 'flex-row':
            return new LayoutNodeCreator(configuration).create()
    }
}
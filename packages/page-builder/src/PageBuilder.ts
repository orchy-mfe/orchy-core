import {MicroFrontendProperties, PageConfiguration} from '@orchy-mfe/models'

import ElementNodeCreator from './node-creator/ElementNodeCreator'
import LayoutNodeCreator from './node-creator/LayoutNodeCreator'
import MicroFrontendNodeCreator from './node-creator/MicroFrontendNodeCreator'

const createNode = (configuration: PageConfiguration, microFrontendProperties: MicroFrontendProperties): HTMLElement => {
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

export const pageBuilder = (
    configurations: PageConfiguration[],
    root: HTMLElement = document.createElement('div'),
    microFrontendProperties: MicroFrontendProperties
    
): HTMLElement => {
    const childrens = configurations.map(configuration => {
        const createdNode = createNode(configuration, microFrontendProperties)
        pageBuilder(configuration.content || [], createdNode, microFrontendProperties)
        return createdNode
    })
    root.replaceChildren(...childrens)
    return root
}
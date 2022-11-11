import {MicroFrontendProperties, PageConfiguration} from '@orchy-mfe/models'
import {Subject, ReplaySubject} from 'rxjs'

import ElementNodeCreator from './node-creator/ElementNodeCreator'
import LayoutNodeCreator from './node-creator/LayoutNodeCreator'
import MicroFrontendNodeCreator from './node-creator/MicroFrontendNodeCreator'

const createNode = (configuration: PageConfiguration, eventBus: Subject<unknown>, microFrontendProperties: MicroFrontendProperties): HTMLElement => {
    switch (configuration.type) {
        case 'element':
            return new ElementNodeCreator(configuration, eventBus).create()
        case 'micro-frontend':
            return new MicroFrontendNodeCreator(configuration, eventBus, microFrontendProperties).create()
        case 'flex-column':
        case 'flex-row':
            return new LayoutNodeCreator(configuration).create()
    }
}

export const pageBuilder = (
    configurations: PageConfiguration[],
    root: HTMLElement = document.createElement('div'),
    eventBus: Subject<unknown> = new ReplaySubject(),
    microFrontendProperties: MicroFrontendProperties
    
): HTMLElement => {
    const childrens = configurations.map(configuration => {
        const createdNode = createNode(configuration, eventBus, microFrontendProperties)
        pageBuilder(configuration.content || [], createdNode, eventBus, microFrontendProperties)
        return createdNode
    })
    root.replaceChildren(...childrens)
    return root
}
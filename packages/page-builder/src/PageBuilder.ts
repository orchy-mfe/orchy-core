import { PageConfiguration } from '@orchy/models'
import { Subject, ReplaySubject } from 'rxjs'

import ElementNodeCreator from './node-creator/ElementNodeCreator'
import ImpaginationNodeCreator from './node-creator/ImpaginationNodeCreator'

const createNode = (configuration: PageConfiguration, eventBus: Subject<unknown>): HTMLElement => {
    switch (configuration.type) {
        case 'element':
            return new ElementNodeCreator(configuration, eventBus).create()
        case 'flex-column':
        case 'flex-row':
            return new ImpaginationNodeCreator(configuration).create()
    }
}

export const pageBuilder = (
    configurations: PageConfiguration[],
    root: HTMLElement = document.createElement('div'),
    eventBus: Subject<unknown> = new ReplaySubject()
): HTMLElement => {
    configurations.forEach(configuration => {
        const createdNode = createNode(configuration, eventBus)
        pageBuilder(configuration.content || [], createdNode, eventBus)
        root.appendChild(createdNode)
    })
    return root
}
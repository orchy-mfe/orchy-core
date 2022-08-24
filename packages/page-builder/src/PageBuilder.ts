import { PageConfiguration } from '@orchy/models'

import ElementNodeCreator from './node-creator/ElementNodeCreator'
import ImpaginationNodeCreator from './node-creator/ImpaginationNodeCreator'

const createNode = (configuration: PageConfiguration): HTMLElement => {
    switch (configuration.type) {
        case 'element':
            return new ElementNodeCreator(configuration).create()
        case 'flex-column':
        case 'flex-row':
            return new ImpaginationNodeCreator(configuration).create()
    }
}

export const pageBuilder = (
    configurations: PageConfiguration[],
    root: HTMLElement = document.createElement('div')
): HTMLElement => {
    configurations.forEach(configuration => {
        const createdNode = createNode(configuration)
        pageBuilder(configuration.content || [], createdNode)
        root.appendChild(createdNode)
    })
    return root
}
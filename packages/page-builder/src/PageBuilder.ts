import { PageConfiguration } from '@orchy/models'

import ElementPageCreator from './node-creator/ElementPageCreator'
import ImpaginatorPageCreator from './node-creator/ImpaginatorPageCreator'

const createNode = (configuration: PageConfiguration): HTMLElement => {
    switch (configuration.type) {
        case 'element':
            return new ElementPageCreator(configuration).create()
        case 'flex-column':
        case 'flex-row':
            return new ImpaginatorPageCreator(configuration).create()
    }
}

const pageBuilder = (
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
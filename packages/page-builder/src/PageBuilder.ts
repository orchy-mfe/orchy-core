import {MicroFrontendProperties, PageConfiguration} from '@orchy-mfe/models'
import createNode from './node-creator'
import enrichNode from './string-node'

const stringConfigStrategy = (configuration: string, microFrontendProperties: MicroFrontendProperties) => {
    const createdNode: ParentNode = document.createRange().createContextualFragment(configuration)
    enrichNode(createdNode, microFrontendProperties)
    return createdNode
}

const jsonConfigStrategy = (configuration: PageConfiguration, microFrontendProperties: MicroFrontendProperties) => {
    const createdNode: HTMLElement = createNode(configuration, microFrontendProperties)
    pageBuilder(configuration.content || [], createdNode, microFrontendProperties)
    return createdNode
}

export const pageBuilder = (
    configurations: Array<PageConfiguration | string>,
    root: ParentNode = document.createElement('div'),
    microFrontendProperties: MicroFrontendProperties
): ParentNode => {
    const childrens = configurations.map(configuration => {
        if(typeof configuration === 'string') {
            return stringConfigStrategy(configuration, microFrontendProperties)
        }
        return jsonConfigStrategy(configuration, microFrontendProperties)
    })
    root.replaceChildren(...childrens)
    return root
}
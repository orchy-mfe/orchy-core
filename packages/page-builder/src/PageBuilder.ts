import {MicroFrontendProperties, PageConfiguration} from '@orchy-mfe/models'
import createNode from './node-creator'
import enrichNode from './string-node'

export const pageBuilder = (
    configurations: Array<PageConfiguration | string>,
    root: ParentNode = document.createElement('div'),
    microFrontendProperties: MicroFrontendProperties
): ParentNode => {
    const childrens = configurations.map(configuration => {
        let createdNode: ParentNode
        if(typeof configuration === 'string') {
            createdNode = document.createRange().createContextualFragment(configuration)
            enrichNode(createdNode, microFrontendProperties)
        } else {
            createdNode = createNode(configuration, microFrontendProperties)
            pageBuilder(configuration.content || [], createdNode, microFrontendProperties)
        }
        return createdNode
    })
    root.replaceChildren(...childrens)
    return root
}
import {MicroFrontendProperties, PageConfiguration} from '@orchy-mfe/models'

import {createNode} from './node-creator'
import {manageNode} from './string-node'

const stringConfigStrategy = (configuration: string, microFrontendProperties: MicroFrontendProperties) => {
    const createdNode: DocumentFragment = document.createRange().createContextualFragment(configuration)
    manageNode(createdNode, microFrontendProperties)
    return createdNode
}

const jsonConfigStrategy = async (configuration: PageConfiguration, microFrontendProperties: MicroFrontendProperties) => {
    const createdNode: HTMLElement = await createNode(configuration, microFrontendProperties)
    await pageBuilder(configuration.content || [], createdNode, microFrontendProperties)
    return createdNode
}

export const pageBuilder = async (
    configurations: Array<PageConfiguration | string>,
    root: ParentNode = document.createElement('div'),
    microFrontendProperties: MicroFrontendProperties
): Promise<ParentNode> => {
    const childrens = await Promise.all(
        configurations.map(configuration => typeof configuration === 'string' ?
            stringConfigStrategy(configuration, microFrontendProperties)
            : jsonConfigStrategy(configuration, microFrontendProperties)
        )
    )
    if (childrens.length) {
        root.replaceChildren(...childrens)
    }
    return root
}
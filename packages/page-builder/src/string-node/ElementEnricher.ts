import {MicroFrontendProperties} from '@orchy-mfe/models'

export const enrichElementNode = (createdNode: ParentNode, microFrontendProperties: MicroFrontendProperties) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    createdNode.querySelectorAll('[orchy-element]').forEach(node => node.eventBus = microFrontendProperties.eventBus)
}
import {MicroFrontendProperties} from '@orchy-mfe/models'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const eventBusSetter = (microFrontendProperties: MicroFrontendProperties) => (node: Node) => node.eventBus = microFrontendProperties.eventBus

export const enrichElementNode = (createdNode: DocumentFragment, microFrontendProperties: MicroFrontendProperties) => {
    const setEventBus = eventBusSetter(microFrontendProperties)

    createdNode.querySelectorAll('[orchy-element]').forEach(setEventBus)
    if(createdNode.firstElementChild?.hasAttribute('orchy-element')) {
        setEventBus(createdNode.firstElementChild)
    }
}
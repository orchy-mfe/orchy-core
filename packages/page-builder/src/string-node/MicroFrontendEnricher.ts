import {MicroFrontendProperties} from '@orchy-mfe/models'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const propertiesSetter = (microFrontendProperties: MicroFrontendProperties) => (node: Node) => node.orchyProperties = microFrontendProperties

export const enrichMicroFrontendNode = (createdNode: DocumentFragment, microFrontendProperties: MicroFrontendProperties) => {
    const setProperties = propertiesSetter(microFrontendProperties)

    createdNode.querySelectorAll('[orchy-micro-frontend]').forEach(setProperties)
    if(createdNode.firstElementChild?.hasAttribute('orchy-micro-frontend')) {
        setProperties(createdNode.firstElementChild)
    }
}
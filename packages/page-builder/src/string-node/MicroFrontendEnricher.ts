import {MicroFrontendProperties} from '@orchy-mfe/models'

export const enrichMicroFrontendNode = (createdNode: ParentNode, microFrontendProperties: MicroFrontendProperties) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    createdNode.querySelectorAll('[orchy-micro-frontend]').forEach(node => node.orchyProperties = microFrontendProperties)
}
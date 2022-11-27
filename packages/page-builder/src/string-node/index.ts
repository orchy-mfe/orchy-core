import {MicroFrontendProperties} from '@orchy-mfe/models'
import {enrichElementNode} from './ElementEnricher'
import {enrichMicroFrontendNode} from './MicroFrontendEnricher'

const enrichNode = (createdNode: DocumentFragment, microFrontendProperties: MicroFrontendProperties) => {
    enrichMicroFrontendNode(createdNode, microFrontendProperties)
    enrichElementNode(createdNode, microFrontendProperties)
}

export default enrichNode
import {MicroFrontendProperties} from '@orchy-mfe/models'
import enrichElementNode from './ElementEnricher'
import enrichMicroFrontendNode from './MicroFrontendEnricher'

const enrichNode = (createdNode: ParentNode, microFrontendProperties: MicroFrontendProperties) => {
    enrichMicroFrontendNode(createdNode, microFrontendProperties)
    enrichElementNode(createdNode, microFrontendProperties)
}

export default enrichNode
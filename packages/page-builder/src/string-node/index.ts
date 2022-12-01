import {MicroFrontendProperties} from '@orchy-mfe/models'

import {enrichElementNode} from './ElementEnricher'
import {enrichMicroFrontendNode} from './MicroFrontendEnricher'
import {shimImporter} from './ShimImporter'

export const manageNode = (createdNode: DocumentFragment, microFrontendProperties: MicroFrontendProperties) => {
    enrichMicroFrontendNode(createdNode, microFrontendProperties)
    enrichElementNode(createdNode, microFrontendProperties)
    shimImporter(createdNode)
}
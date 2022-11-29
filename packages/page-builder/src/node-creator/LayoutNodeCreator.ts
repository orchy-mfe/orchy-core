import {LayoutPageConfiguration} from '@orchy-mfe/models'

import CommonNodeCreator from './CommonNodeCreator'

class LayoutNodeCreator extends CommonNodeCreator {
    currentNode: HTMLElement

    private static stylesByType: Record<LayoutPageConfiguration['type'], string> = {
        'flex-column': 'display: flex; flex-direction: column',
        'flex-row': 'display: flex; flex-direction: row'
    }

    constructor(configuration: LayoutPageConfiguration) {
        super(configuration)
        this.currentNode = document.createElement('div')
        this.currentNode.setAttribute('style', LayoutNodeCreator.stylesByType[configuration.type])
    }
    
}

export default LayoutNodeCreator
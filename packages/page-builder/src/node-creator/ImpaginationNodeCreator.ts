import {ImpaginationPageConfiguration} from '@orchy/models'

import CommonNodeCreator from './CommonNodeCreator'

class ImpaginationNodeCreator extends CommonNodeCreator {

    currentNode: HTMLElement

    private static stylesByType: Record<ImpaginationPageConfiguration['type'], string> = {
        'flex-column': 'display: flex; flex-direction: column',
        'flex-row': 'display: flex; flex-direction: row'
    }

    constructor(configuration: ImpaginationPageConfiguration) {
        super(configuration)
        this.currentNode = document.createElement('div')
        this.currentNode.setAttribute('style', ImpaginationNodeCreator.stylesByType[configuration.type])
    }
    
}

export default ImpaginationNodeCreator
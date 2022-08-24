import { ImpaginationPageConfiguration } from "@orchy/models"

import CommonPageCreator from "./CommonPageCreator"

class ImpaginatorPageCreator extends CommonPageCreator {

    currentNode: HTMLElement

    private static stylesByType: Record<ImpaginationPageConfiguration["type"], string> = {
        "flex-column": "display: flex; flex-direction: column",
        "flex-row": "display: flex; flex-direction: row"
    }

    constructor(configuration: ImpaginationPageConfiguration) {
        super(configuration)
        this.currentNode = document.createElement('div')
        this.currentNode.setAttribute('style', ImpaginatorPageCreator.stylesByType[configuration.type])
    }
    
}

export default ImpaginatorPageCreator
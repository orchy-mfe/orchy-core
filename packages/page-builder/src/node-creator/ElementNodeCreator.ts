import { ElementPageConfiguration } from "@orchy/models"
import {Subject} from "rxjs"

import CommonNodeCreator from "./CommonNodeCreator"

class ElementNodeCreator extends CommonNodeCreator {

    currentNode: HTMLElement

    constructor(private elementConfiguration: ElementPageConfiguration, private eventBus: Subject<unknown>) {
        super({ ...elementConfiguration, properties: { ...elementConfiguration.properties, eventBus } })
        this.currentNode = document.createElement(elementConfiguration.tag)
    }

    public create(): HTMLElement {
        this.importScript()
        return super.create()
    }

    private importScript() {
        if (this.elementConfiguration.url) {
            const isEsmUrl = this.elementConfiguration.url.endsWith('.esm.js')
            if (isEsmUrl) {
                import(this.elementConfiguration.url)
            } else {
                const scriptCreator = new ElementNodeCreator({ attributes: { src: this.elementConfiguration.url }, type: 'element', tag: 'script' }, this.eventBus)
                document.head.appendChild(scriptCreator.create())
            }
        }
    }

}

export default ElementNodeCreator
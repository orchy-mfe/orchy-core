import { ElementPageConfiguration } from "@orchy/models"
import { ReplaySubject } from "rxjs"

import CommonNodeCreator from "./CommonNodeCreator"

class ElementNodeCreator extends CommonNodeCreator {

    currentNode: HTMLElement

    private static eventBus = new ReplaySubject<unknown>()

    constructor(private elementConfiguration: ElementPageConfiguration) {
        super({ ...elementConfiguration, properties: { ...elementConfiguration.properties, eventBus: ElementNodeCreator.eventBus } })
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
                const scriptCreator = new ElementNodeCreator({ attributes: { src: this.elementConfiguration.url }, type: 'element', tag: 'script' })
                document.head.appendChild(scriptCreator.create())
            }
        }
    }

}

export default ElementNodeCreator
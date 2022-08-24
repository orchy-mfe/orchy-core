import { ElementPageConfiguration } from "@orchy/models"
import { ReplaySubject } from "rxjs"

import CommonPageCreator from "./CommonPageCreator"

class ElementPageCreator extends CommonPageCreator {

    currentNode: HTMLElement

    private static eventBus = new ReplaySubject<unknown>()

    constructor(private elementConfiguration: ElementPageConfiguration) {
        super({ ...elementConfiguration, properties: { ...elementConfiguration.properties, eventBus: ElementPageCreator.eventBus } })
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
                const scriptCreator = new ElementPageCreator({ attributes: { src: this.elementConfiguration.url }, type: 'element', tag: 'script' })
                document.head.appendChild(scriptCreator.create())
            }
        }
    }

}

export default ElementPageCreator
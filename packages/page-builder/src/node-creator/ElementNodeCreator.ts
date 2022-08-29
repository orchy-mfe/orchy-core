import { ElementPageConfiguration } from "@orchy/models"
import {Subject} from "rxjs"

import CommonNodeCreator from "./CommonNodeCreator"

const ESM_SUFFIXES = [".esm.js", ".mjs"]

declare global {
    interface Window {
        importShim?: (scriptUrl: string) => void;
    }
}

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
            const scriptUrl = this.elementConfiguration.url
            const isEsmUrl = ESM_SUFFIXES.some(suffix => scriptUrl.endsWith(suffix))
            if (isEsmUrl) {
                if(window.importShim) {
                    window.importShim(scriptUrl)
                } else {
                    import(scriptUrl)
                }
            } else {
                const scriptCreator = new ElementNodeCreator({ attributes: { src: this.elementConfiguration.url }, type: 'element', tag: 'script' }, this.eventBus)
                document.head.appendChild(scriptCreator.create())
            }
        }
    }

}

export default ElementNodeCreator
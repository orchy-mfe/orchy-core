import {ElementPageConfiguration} from '@orchy-mfe/models'
import {Subject} from 'rxjs'

import CommonNodeCreator from './CommonNodeCreator'
declare global {
    interface Window {
        importShim?: (scriptUrl: string) => void;
    }
}

class ElementNodeCreator extends CommonNodeCreator {

    currentNode: HTMLElement

    constructor(private elementConfiguration: ElementPageConfiguration, eventBus?: Subject<unknown>) {
        super({...elementConfiguration, properties: {...elementConfiguration.properties, eventBus}})
        this.currentNode = document.createElement(elementConfiguration.tag)
    }

    public create(): HTMLElement {
        this.importScript()
        return super.create()
    }

    private manageEsmScript(scriptUrl: string) {
        if(window.importShim) {
            window.importShim(scriptUrl)
        } else {
            import(/* @vite-ignore */ /* webpackIgnore: true */scriptUrl)
        }
    }

    private importScript() {
        if (this.elementConfiguration.url) {
            this.manageEsmScript(this.elementConfiguration.url)
        }
    }

}

export default ElementNodeCreator
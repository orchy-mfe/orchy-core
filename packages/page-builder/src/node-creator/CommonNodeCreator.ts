import {CommonPageConfiguration} from '@orchy/models'

abstract class CommonNodeCreator {
    constructor(private configuration: CommonPageConfiguration) { }

    public create(): HTMLElement {
        this.applyAttributes()
        this.applyProperties()
        return this.currentNode
    }

    private applyAttributes() {
        Object.entries(this.configuration.attributes || {})
            .forEach(([key, value]) => {
                const attributesToAppend = [this.currentNode.getAttribute(key), value].filter(Boolean).join(';') 
                this.currentNode.setAttribute(key, attributesToAppend)
            })
    }

    private applyProperties() {
        Object.entries(this.configuration.properties || {})
            .forEach(([key, value]) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this.currentNode[key] = value
            })
    }

    abstract get currentNode(): HTMLElement
}

export default CommonNodeCreator
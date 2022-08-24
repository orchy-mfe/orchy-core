import { CommonPageConfiguration } from "@orchy/models"

abstract class CommonPageCreator {
    constructor(private configuration: CommonPageConfiguration) { }

    public create(): HTMLElement {
        this.applyAttributes()
        this.applyProperties()
        return this.currentNode
    }

    private applyAttributes() {
        Object.entries(this.configuration.attributes || {})
            .forEach(([key, value]) => {
                const currentAttribute = this.currentNode.getAttribute(key)
                this.currentNode.setAttribute(key, `${currentAttribute}; ${value || ''}`)
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

export default CommonPageCreator
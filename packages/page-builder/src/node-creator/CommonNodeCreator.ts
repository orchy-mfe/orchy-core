import {CommonPageConfiguration} from '@orchy-mfe/models'

abstract class CommonNodeCreator {
    constructor(private configuration: CommonPageConfiguration) { }

    public create(): Promise<HTMLElement> {
        this.applyAttributes()
        this.applyProperties()
        return Promise.resolve(this.currentNode)
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
import {MicroFrontendProperties, SsrMicroFrontendConfiguration} from '@orchy-mfe/models'

import CommonNodeCreator from './CommonNodeCreator'

export default class SsrMicroFrontendNodeCreator extends CommonNodeCreator {
    currentNode: HTMLElement = document.createElement('div')

    constructor(private elementConfiguration: SsrMicroFrontendConfiguration, microFrontendProperties: MicroFrontendProperties) {
        const orchyProperties = {...microFrontendProperties, ...elementConfiguration.attributes, ...elementConfiguration.properties}
        super({...elementConfiguration, properties: {orchyProperties}})
    }

    public async create(): Promise<HTMLElement> {
        await this.importHtml()
        return super.create()
    }

    private async importHtml() {
        const htmlResponse = await fetch(this.elementConfiguration.url).then(res => res.text())
        this.currentNode.innerHTML = htmlResponse
    }
}
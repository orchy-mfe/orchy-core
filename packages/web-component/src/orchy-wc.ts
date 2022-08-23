import { LitElement, html } from 'lit'
import Navigo from 'navigo'
import { customElement, property } from 'lit/decorators.js'

import httpConfigurationRetriever from './configuration-retriever/httpConfigurationRetriever'
import configurationRegister from './configurationRegister'

@customElement('orchy-wc')
export class OrchyWC extends LitElement {
  @property()
  configurationName = 'orchy-config'

  @property()
  basePath = '/'

  override connectedCallback(): void {
    super.connectedCallback()
    const router = new Navigo(this.basePath)
    httpConfigurationRetriever(this.configurationName)
      .then((configuration) => configurationRegister(configuration, router))
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'orchy-wc': OrchyWC
  }
}

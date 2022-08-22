import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import httpConfigurationRetriever from './configuration-retriever/httpConfigurationRetriever'
import configurationRegister from './configurationRegister'

@customElement('orchy-wc')
export class OrchyWC extends LitElement {
  @property()
  configurationName = 'orchy-configuration'

  override connectedCallback(): void {
    super.connectedCallback()
    httpConfigurationRetriever(this.configurationName)
      .then(configurationRegister)
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

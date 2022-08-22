import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('orchy-wc')
export class OrchyWC extends LitElement {
  @property()
  configurationName = 'orchy-configuration'

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'orchy-wc': OrchyWC
  }
}

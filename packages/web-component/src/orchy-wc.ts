import { LitElement, html } from 'lit'
import Navigo from 'navigo'
import { customElement, property } from 'lit/decorators.js'

import configurationRegister from './configurationRegister'
import ConfigurationManager from './configuration-manager/configurationManager'
import HttpConfigurationManager from './configuration-manager/httpConfigurationManager'

@customElement('orchy-wc')
export class OrchyWC extends LitElement {
  @property()
  configurationName = 'orchy-config'

  @property()
  basePath = '/'

  private configurationManager: ConfigurationManager = new HttpConfigurationManager()

  override connectedCallback(): void {
    super.connectedCallback()
    const router = new Navigo(this.basePath)
    this.configurationManager.retrieveConfiguration(this.configurationName)
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

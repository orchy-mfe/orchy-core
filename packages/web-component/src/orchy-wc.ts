import { LitElement, html } from 'lit'
import Navigo from 'navigo'
import { customElement, property } from 'lit/decorators.js'
import { Configuration } from '@orchy/models'

import configurationRegister from './configurationRegister'
import ConfigurationClient from './configuration-client/configurationClient'
import HttpConfigurationClient from './configuration-client/httpConfigurationClient'

@customElement('orchy-wc')
export class OrchyWC extends LitElement {
  @property()
  configurationName = 'orchy-config'

  @property()
  basePath = '/'

  private configurationManager: ConfigurationClient = new HttpConfigurationClient()

  override connectedCallback(): void {
    super.connectedCallback()
    const router = new Navigo(this.basePath)
    this.configurationManager.retrieveConfiguration<Configuration>(this.configurationName)
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

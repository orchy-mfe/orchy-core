import './history-patcher'

import {Configuration} from '@orchy-mfe/models'
import {html, LitElement, PropertyValueMap} from 'lit'
import {customElement, property} from 'lit/decorators.js'

import ConfigurationClient from './configuration-client/configurationClient'
import HttpConfigurationClient from './configuration-client/httpConfigurationClient'
import configurationRegister from './configuration-register/configurationRegister'
import WebComponentState from './web-component-state/WebComponentState'

@customElement('orchy-wc')
export class OrchyWC extends LitElement {
  @property()
  configurationName = 'orchy-config.json'

  @property()
  basePath = window.location.pathname

  private configurationClient: ConfigurationClient = new HttpConfigurationClient()

  private webComponentState?: WebComponentState

  protected override firstUpdated(changedProperties: PropertyValueMap<unknown> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(changedProperties)
    this.webComponentState = new WebComponentState(this.renderRoot as HTMLElement, this.basePath)
    this.configurationClient
      .retrieveConfiguration<Configuration>(this.configurationName)
      .then(content => {
        const configuration = {content: content as Configuration, client: this.configurationClient}
        configurationRegister(configuration, this.webComponentState as WebComponentState)
      })
  }

  render() {
    return html``
  }

  disconnectedCallback(): void {
      super.disconnectedCallback()
      this.webComponentState?.destroy()
  }

  protected createRenderRoot() {
    return this
  }
  
}

declare global {
  interface HTMLElementTagNameMap {
    'orchy-wc': OrchyWC
  }
}

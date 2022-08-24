import { LitElement, html } from 'lit'
import Navigo from 'navigo'
import { customElement, property, state } from 'lit/decorators.js'
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

  @state()
  pageContent?: HTMLElement

  private configurationClient: ConfigurationClient = new HttpConfigurationClient()

  override connectedCallback(): void {
    super.connectedCallback()
    const router = new Navigo(this.basePath)
    this.configurationClient
      .retrieveConfiguration<Configuration>(this.configurationName)
      .then(content => {
        const configuration = { content, client: this.configurationClient }
        const setPageContent = (pageContent: HTMLElement) => { this.pageContent = pageContent }
        configurationRegister(configuration, router, setPageContent)
      })
  }

  render() {
    return html`
      ${this.pageContent}
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'orchy-wc': OrchyWC
  }
}

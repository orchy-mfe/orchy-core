import {LitElement, html, PropertyValueMap} from 'lit'
import Navigo from 'navigo'
import {customElement, property} from 'lit/decorators.js'
import {Configuration} from '@orchy-mfe/models'

import configurationRegister from './configurationRegister'
import ConfigurationClient from './configuration-client/configurationClient'
import HttpConfigurationClient from './configuration-client/httpConfigurationClient'

@customElement('orchy-wc')
export class OrchyWC extends LitElement {
  @property()
  configurationName = 'orchy-config'

  @property()
  basePath = window.location.pathname

  private configurationClient: ConfigurationClient = new HttpConfigurationClient()

  private router?: Navigo

  protected override firstUpdated(changedProperties: PropertyValueMap<unknown> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(changedProperties)
    this.createRouter()
    this.configurationClient
      .retrieveConfiguration<Configuration>(this.configurationName)
      .then(content => {
        const configuration = {content, client: this.configurationClient}
        configurationRegister(configuration, this.router as Navigo, this.setPageContent.bind(this))
      })
  }

  private createRouter() {
    this.router = new Navigo(this.basePath)
    this.router.notFound(() => true)
  }

  private setPageContent(pageContent: HTMLElement) {
    this.renderRoot.replaceChildren(pageContent)
  }

  render() {
    return html``
  }

  disconnectedCallback(): void {
      super.disconnectedCallback()
      this.router?.destroy()
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

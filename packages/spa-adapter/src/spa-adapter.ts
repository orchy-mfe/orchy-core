import {MicroFrontendProperties} from '@orchy-mfe/models'
import {LitElement, html} from 'lit'
import {property} from 'lit/decorators.js'

export default abstract class OrchyBaseMfe extends LitElement {
    abstract mount(orchyProperties?: MicroFrontendProperties): Promise<void>
    abstract unmount(orchyProperties?: MicroFrontendProperties): Promise<void>

    private _orchyProperties?: MicroFrontendProperties
    private isOrchyBoot = false

    @property({attribute: false})
    get orchyProperties (): MicroFrontendProperties | undefined {
        return this._orchyProperties
    }

    set orchyProperties (orchyProperties: MicroFrontendProperties | undefined) {
        this.isOrchyBoot = true
        this.unmount(this._orchyProperties)
        this._orchyProperties = orchyProperties
        this.mount(orchyProperties)
    }

    protected override firstUpdated(changedProperties: Map<PropertyKey, unknown>): void {
        super.firstUpdated(changedProperties)
        if(!this.isOrchyBoot) {
            this.orchyProperties = undefined
        }
      }

    public getContainer(): HTMLElement {
        return this.renderRoot as HTMLElement
    }

    disconnectedCallback(): void {
        super.disconnectedCallback()
        this.unmount(this.orchyProperties)
    }

    render() {
        return html``
    }

    protected createRenderRoot() {
        return this
    }

}
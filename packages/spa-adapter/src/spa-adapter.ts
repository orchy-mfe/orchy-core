import {MicroFrontendProperties} from '@orchy-mfe/models'
import {LitElement, html} from 'lit'
import {property} from 'lit/decorators.js'

export default abstract class OrchyMicroFrontend<E = unknown> extends LitElement {
    abstract mount(orchyProperties?: MicroFrontendProperties<E>): Promise<void>
    abstract unmount(orchyProperties?: MicroFrontendProperties<E>): Promise<void>

    @property({attribute: false})
    private orchyProperties?: MicroFrontendProperties<E>

    protected override firstUpdated(changedProperties: Map<PropertyKey, unknown>): void {
        super.firstUpdated(changedProperties)
        this.mount(this.orchyProperties)
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
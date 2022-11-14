import { MicroFrontendProperties } from '@orchy-mfe/models';
import { LitElement } from 'lit';
export default abstract class OrchyMicroFrontend<E = unknown> extends LitElement {
    abstract mount(orchyProperties?: MicroFrontendProperties<E>): Promise<void>;
    abstract unmount(orchyProperties?: MicroFrontendProperties<E>): Promise<void>;
    private _orchyProperties?;
    private isOrchyBoot;
    get orchyProperties(): MicroFrontendProperties<E> | undefined;
    set orchyProperties(orchyProperties: MicroFrontendProperties<E> | undefined);
    protected firstUpdated(changedProperties: Map<PropertyKey, unknown>): void;
    getContainer(): HTMLElement;
    disconnectedCallback(): void;
    render(): import("lit").TemplateResult<1>;
    protected createRenderRoot(): this;
}

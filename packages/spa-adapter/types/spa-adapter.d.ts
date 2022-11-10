import { MicroFrontendProperties } from '@orchy-mfe/models';
import { LitElement } from 'lit';
export default abstract class OrchyBaseMfe extends LitElement {
    abstract mount(orchyProperties?: MicroFrontendProperties): Promise<void>;
    abstract unmount(orchyProperties?: MicroFrontendProperties): Promise<void>;
    private _orchyProperties?;
    private isOrchyBoot;
    get orchyProperties(): MicroFrontendProperties | undefined;
    set orchyProperties(orchyProperties: MicroFrontendProperties | undefined);
    protected firstUpdated(changedProperties: Map<PropertyKey, unknown>): void;
    getContainer(): HTMLElement;
    disconnectedCallback(): void;
    render(): import("lit").TemplateResult<1>;
    protected createRenderRoot(): this;
}

import { LitElement, PropertyValueMap } from 'lit';
export declare class OrchyWC extends LitElement {
    configurationName: string;
    basePath: string;
    private configurationClient;
    private webComponentState?;
    protected firstUpdated(changedProperties: PropertyValueMap<unknown> | Map<PropertyKey, unknown>): void;
    render(): import("lit").TemplateResult<1>;
    disconnectedCallback(): void;
    protected createRenderRoot(): this;
}
declare global {
    interface HTMLElementTagNameMap {
        'orchy-wc': OrchyWC;
    }
}

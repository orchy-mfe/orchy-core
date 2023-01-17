import Navigo from 'navigo'

import EventBusSubject from '../event-bus/EventBusSubject'
export default class WebComponentState {
    private renderRoot
    private _router
    private _eventBus
    constructor(renderRoot: HTMLElement, basePath: string, eventBus?: EventBusSubject<unknown>);
    destroy(): void;
    get router(): Navigo;
    get eventBus(): EventBusSubject<unknown>;
    get rootElement(): HTMLElement;
}

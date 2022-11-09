import Navigo from 'navigo'
import EventBusSubject from './event-bus/EventBusSubject'

export default class WebComponentState {
    private _router: Navigo
    private _eventBus = new EventBusSubject()

    constructor(
        private renderRoot: HTMLElement,
        basePath: string
    ){
        this._router = new Navigo(basePath)
        this._router.notFound(() => true)
    }

    public destroy() {
        this.router.destroy()
        this._eventBus.complete()
    }

    public get router(): Navigo {
        return this._router
    }

    public get eventBus(): EventBusSubject<unknown> {
        return this._eventBus
    }

    public get rootElement(): HTMLElement {
        return this.renderRoot
    }
}
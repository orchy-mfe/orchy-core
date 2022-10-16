import Navigo from 'navigo'
import {MicroApp} from 'qiankun'
import EventBusSubject from './event-bus/EventBusSubject'

export default class WebComponentState {
    private _router: Navigo
    private microApps: MicroApp[] = []
    private _eventBus = new EventBusSubject()

    constructor(
        private renderRoot: HTMLElement | ShadowRoot,
        basePath: string
    ){
        this._router = new Navigo(basePath)
        this._router.notFound(() => true)
    }

    public destroy() {
        this.router.destroy()
        this._eventBus.complete()
        this.routeLeave()
    }

    public routeLeave() {
        this.microApps.forEach(app => app?.unmount().catch(console.error))
    }

    public get router(): Navigo {
        return this._router
    }

    public get eventBus(): EventBusSubject<unknown> {
        return this._eventBus
    }

    public setLoadedMicroFrontends(microApps: MicroApp[] = []) {
        this.microApps = microApps
    }

    public setPageContent(pageContent: HTMLElement) {
        this.renderRoot.replaceChildren(pageContent)
    }
}
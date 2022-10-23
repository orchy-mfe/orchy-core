import Navigo from 'navigo'
import {MicroApp} from 'qiankun'

import EventBusRegistry from './event-bus/EventBusRegistry'
import EventBusSubject from './event-bus/EventBusSubject'

export default class WebComponentState {
    private _router: Navigo
    private microApps: MicroApp[] = []
    private eventBusRegistry = new EventBusRegistry()

    constructor(
        private renderRoot: HTMLElement | ShadowRoot,
        basePath: string
    ){
        this._router = new Navigo(basePath)
        this._router.notFound(() => true)
    }

    public destroy() {
        this.router.destroy()
        this.eventBusRegistry.destroyBus()
        this.routeLeave()
    }

    public routeLeave() {
        this.microApps.forEach(app => app?.unmount().catch(console.error))
    }

    public async routeChange(microApps: Promise<MicroApp[]>) {
        this.eventBusRegistry.clearBus()
        this.setLoadedMicroFrontends(await microApps)
    }

    public get router(): Navigo {
        return this._router
    }

    public getEventBus(eventBusDiscriminator?: string): EventBusSubject<unknown> {
        return this.eventBusRegistry.getBus(eventBusDiscriminator)
    }

    public setLoadedMicroFrontends(microApps: MicroApp[] = []) {
        this.microApps = microApps
    }

    public setPageContent(pageContent: HTMLElement) {
        this.renderRoot.replaceChildren(pageContent)
    }
}
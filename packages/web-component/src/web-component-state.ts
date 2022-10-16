import Navigo from 'navigo'
import {MicroApp} from 'qiankun'

export default class WebComponentState {
    private _router: Navigo
    private microApps: MicroApp[] = []
    constructor(
        private renderRoot: HTMLElement | ShadowRoot,
        basePath: string
    ){
        this._router = new Navigo(basePath)
        this._router.notFound(() => true)
    }

    public destroy() {
        this.router.destroy()
        this.unloadMicroFrontends()
    }

    public get router(): Navigo {
        return this.router
    }

    public setLoadedMicroFrontends(microApps: MicroApp[] = []) {
        this.microApps = microApps
    }

    public unloadMicroFrontends() {
        this.microApps.forEach(app => app?.unmount().catch(console.error))
    }

    public setPageContent(pageContent: HTMLElement) {
        this.renderRoot.replaceChildren(pageContent)
    }
}
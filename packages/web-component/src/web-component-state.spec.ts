import {MicroApp} from 'qiankun'
import {describe, it, expect, vi} from 'vitest'

import WebComponentState from './web-component-state'


describe('WebComponentState', () => {
    it('should correctly setPageContent', () => {
        document.body.replaceChildren = vi.fn()
        const elementToInsert = document.createElement('div')

        const webComponentState = new WebComponentState(document.body, '/')
        webComponentState.setPageContent(elementToInsert)

        expect(document.body.replaceChildren).toHaveBeenCalledTimes(1)
        expect(document.body.replaceChildren).toHaveBeenCalledWith(elementToInsert)
    })

    it('should create and return a router', () => {
        const basePath = '/router/basePath'
        const webComponentState = new WebComponentState(document.body, basePath)

        expect(webComponentState.router).toBeDefined()
        expect(webComponentState.router.root).toBe(basePath.slice(1))
    })

    it('should return the default eventBus', () => {
        const webComponentState = new WebComponentState(document.body, '/')
    
        expect(webComponentState.getEventBus()).toBeDefined()
    })

    it('should correctly set and unmount Micro Frontends', () => {
        const webComponentState = new WebComponentState(document.body, '/')
        const createUnmountMock = () => vi.fn().mockReturnValueOnce(Promise.resolve())

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const microApps: MicroApp[] = [{unmount: createUnmountMock()}, {unmount: createUnmountMock()}]

        webComponentState.setLoadedMicroFrontends(microApps)
        webComponentState.routeLeave()

        expect(microApps[0].unmount).toHaveBeenCalledOnce()
        expect(microApps[1].unmount).toHaveBeenCalledOnce()
    })
})
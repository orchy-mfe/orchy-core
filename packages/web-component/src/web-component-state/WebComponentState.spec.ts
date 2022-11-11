import {describe, it, expect} from 'vitest'

import WebComponentState from './WebComponentState'


describe('WebComponentState', () => {
    it('should correctly return rootElement', () => {
        const webComponentState = new WebComponentState(document.body, '/')

        expect(webComponentState.rootElement).toBe(document.body)
    })

    it('should create and return a router', () => {
        const basePath = '/router/basePath'
        const webComponentState = new WebComponentState(document.body, basePath)

        expect(webComponentState.router).toBeDefined()
        expect(webComponentState.router.root).toBe(basePath.slice(1))
    })

    it('should return an eventBus', () => {
        const webComponentState = new WebComponentState(document.body, '/')

        expect(webComponentState.eventBus).toBeDefined()
    })

    it('should destroy correctly', () => {
        const webComponentState = new WebComponentState(document.body, '/')
        webComponentState.destroy()

        expect(() => webComponentState.destroy()).not.toThrow()
    })
})
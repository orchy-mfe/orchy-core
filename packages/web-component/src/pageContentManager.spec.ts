import {describe, it, expect, vi} from 'vitest'

import EventBusSubject from './event-bus/EventBusSubject'
import pageContentManagerBuilder from './pageContentManager'
import WebComponentState from './web-component-state'

describe('pageContentManager', () => {
    const createAppendableIframe = () => {
        const container = document.createElement('div')
        const iframe = document.createElement('iframe')
        container.append(iframe)

        return {container, iframe}
    }
    const createWebComponentState = (setPageContent, eventBus = new EventBusSubject()) => {
        const webComponentState = new WebComponentState(document.body, '/')
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        webComponentState._eventBus = eventBus
        webComponentState.setPageContent = setPageContent
        return webComponentState
    }
    it('correctly invokes setPageContent', () => {
        const setPageContentMock = vi.fn()
        const elementToCreate = document.createElement('div')

        const pageContentManager = pageContentManagerBuilder(createWebComponentState(setPageContentMock))
        pageContentManager(elementToCreate)

        expect(setPageContentMock).toHaveBeenCalledWith(elementToCreate)
    })

    it('correctly send message through eventBus', () => {
        const {container, iframe} = createAppendableIframe()
        // eslint-disable-next-line
        // @ts-ignore
        iframe.contentWindow = {
            parent: window,
            postMessage: vi.fn()
        }
        const eventBus = new EventBusSubject()        
        const messageToSend = 'hello from bus'
        eventBus.next(messageToSend)

        const pageContentManager = pageContentManagerBuilder(createWebComponentState(document.body.appendChild.bind(document), eventBus))
        pageContentManager(container)

        expect(iframe.contentWindow?.postMessage).toHaveBeenCalledWith(messageToSend, '*')
    })

    it('correctly receive message through eventBus', () => new Promise((resolve) => {
        const {container, iframe} = createAppendableIframe()
        // eslint-disable-next-line
        // @ts-ignore
        iframe.contentWindow = {
            parent: window,
            postMessage: vi.fn()
        }
        const eventBus = new EventBusSubject()        
        const messageToSend = 'hello from bus'

        const pageContentManager = pageContentManagerBuilder(createWebComponentState(document.body.appendChild.bind(document), eventBus))
        pageContentManager(container)

        // eslint-disable-next-line
        // @ts-ignore
        window.onmessage?.({data: messageToSend})

        eventBus.subscribe(message => {
            expect(message).toBe(messageToSend)
            resolve(true)
        })
    }))
})
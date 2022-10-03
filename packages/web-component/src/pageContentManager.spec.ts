import {describe, it, expect, vi} from 'vitest'

import EventBusSubject from './event-bus/EventBusSubject'
import pageContentManagerBuilder from './pageContentManager'

describe('pageContentManager', () => {
    const createAppendableIframe = () => {
        const container = document.createElement('div')
        const iframe = document.createElement('iframe')
        container.append(iframe)

        return {container, iframe}
    }
    it('correctly invokes setPageContent', () => {
        const setPageContentMock = vi.fn()
        const elementToCreate = document.createElement('div')

        const pageContentManager = pageContentManagerBuilder(setPageContentMock, new EventBusSubject())
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

        const pageContentManager = pageContentManagerBuilder(document.body.appendChild.bind(document), eventBus)
        pageContentManager(container)

        expect(iframe.contentWindow?.postMessage).toHaveBeenCalledWith(messageToSend)
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

        const pageContentManager = pageContentManagerBuilder(document.body.appendChild.bind(document), eventBus)
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
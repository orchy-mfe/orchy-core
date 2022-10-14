import {Subject, takeUntil} from 'rxjs'

import EventBusSubject from './event-bus/EventBusSubject'

type setPageContent = (htmlElement: HTMLElement) => void

const pageContentManagerBuilder = (setPageContent: setPageContent, eventBus: EventBusSubject<unknown>) => {
    const messageHandler = (messageEvent: MessageEvent) => { eventBus.next(messageEvent.data) }

    const attachIframeMessageHandler = (iframeElement: HTMLIFrameElement) => {
        if(iframeElement.contentWindow) 
            iframeElement.contentWindow.parent.onmessage = messageHandler
    }
    
    const handleIframeBusEvent = (iframeElements: NodeListOf<HTMLIFrameElement>, unsubscriber: Subject<unknown>) => (data: unknown) => {
        iframeElements.forEach(iframeElement => {
            if(iframeElement.contentWindow) iframeElement.contentWindow.postMessage(data, '*')
            else {
                unsubscriber.next(undefined)
                unsubscriber.unsubscribe()
            }
        })
    }
    
    const manageIframe = (pageContent: HTMLElement) => {
        const iframeElements = pageContent.querySelectorAll('iframe') as NodeListOf<HTMLIFrameElement>
        iframeElements.forEach(attachIframeMessageHandler)
        const unsubscriber = new Subject()
        eventBus
            .pipe(takeUntil(unsubscriber))
            .subscribe(handleIframeBusEvent(iframeElements, unsubscriber))
    }

    return (pageContent: HTMLElement) => {
        setPageContent(pageContent)
        manageIframe(pageContent)
    }
}

export default pageContentManagerBuilder
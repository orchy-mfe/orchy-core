import {ReplaySubject} from 'rxjs'
import {describe, expect,it} from 'vitest'

import {enrichMicroFrontendNode} from './MicroFrontendEnricher'

describe('ElementEnricher', () => {
    const microFrontendProperties = {eventBus: new ReplaySubject(), basePath: '/'}
    
    it('works if query returns no element', () => {
        const divElement = document.createRange().createContextualFragment('<div></div>')
        enrichMicroFrontendNode(divElement, microFrontendProperties)

        expect(divElement.orchyProperties).toBeUndefined()
    })

    it('work if element is on root', () => {
        const divElement = document.createRange().createContextualFragment('<div orchy-micro-frontend></div>')

        enrichMicroFrontendNode(divElement, microFrontendProperties)

        expect(divElement.childNodes[0].orchyProperties).toBe(microFrontendProperties)
    })

    it('works if element is a leaf', () => {
        const divElement = document.createRange().createContextualFragment('<div><div orchy-micro-frontend></div></div>')

        enrichMicroFrontendNode(divElement, microFrontendProperties)

        expect(divElement.orchyProperties).toBeUndefined()
        expect(divElement.children[0].orchyProperties).toBeUndefined()
        expect(divElement.children[0].children[0].orchyProperties).toBe(microFrontendProperties)
    })
})
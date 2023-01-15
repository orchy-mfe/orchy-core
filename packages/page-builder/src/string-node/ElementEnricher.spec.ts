import {ReplaySubject} from 'rxjs'
import {describe, expect,it} from 'vitest'

import {enrichElementNode} from './ElementEnricher'

describe('ElementEnricher', () => {
    const microFrontendProperties = {eventBus: new ReplaySubject(), basePath: '/'}
    
    it('works if query returns no element', () => {
        const divElement = document.createRange().createContextualFragment('<div></div>')
        enrichElementNode(divElement, microFrontendProperties)

        expect(divElement.eventBus).toBeUndefined()
    })

    it('work if element is on root', () => {
        const divElement = document.createRange().createContextualFragment('<div orchy-element></div>')

        enrichElementNode(divElement, microFrontendProperties)

        expect(divElement.childNodes[0].eventBus).toBe(microFrontendProperties.eventBus)
    })

    it('works if element is a leaf', () => {
        const divElement = document.createRange().createContextualFragment('<div><div orchy-element></div></div>')

        enrichElementNode(divElement, microFrontendProperties)

        expect(divElement.eventBus).toBeUndefined()
        expect(divElement.children[0].eventBus).toBeUndefined()
        expect(divElement.children[0].children[0].eventBus).toBe(microFrontendProperties.eventBus)
    })
})
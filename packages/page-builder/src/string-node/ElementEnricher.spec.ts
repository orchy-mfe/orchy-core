import {ReplaySubject} from 'rxjs'
import {describe, it, expect} from 'vitest'

import {enrichElementNode} from './ElementEnricher'

describe('ElementEnricher', () => {
    const microFrontendProperties = {eventBus: new ReplaySubject(), basePath: '/'}
    
    it('works if query returns no element', () => {
        const divElement = document.createElement('div')
        enrichElementNode(divElement, microFrontendProperties)

        expect(divElement.eventBus).toBeUndefined()
    })

    it('ignored if element is not a leaf', () => {
        const divElement = document.createElement('div')
        divElement.setAttribute('orchy-element', '')

        enrichElementNode(divElement, microFrontendProperties)

        expect(divElement.eventBus).toBeUndefined()
    })

    it('works if element is a leaf', () => {
        const divElement = document.createElement('div')
        const childElement = document.createElement('div')
        childElement.setAttribute('orchy-element', '')
        divElement.appendChild(childElement)

        enrichElementNode(divElement, microFrontendProperties)

        expect(divElement.eventBus).toBeUndefined()
        expect(childElement.eventBus).toBe(microFrontendProperties.eventBus)
    })
})
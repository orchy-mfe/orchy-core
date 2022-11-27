import {ReplaySubject} from 'rxjs'
import {describe, it, expect} from 'vitest'

import {enrichMicroFrontendNode} from './MicroFrontendEnricher'

describe('MicroFrontendEnricher', () => {
    const microFrontendProperties = {eventBus: new ReplaySubject(), basePath: '/'}

    it('works if query returns no element', () => {
        const divElement = document.createElement('div')
        enrichMicroFrontendNode(divElement, microFrontendProperties)

        expect(divElement.eventBus).toBeUndefined()
    })

    it('ignored if element is not a leaf', () => {
        const divElement = document.createElement('div')
        divElement.setAttribute('orchy-micro-frontend', '')

        enrichMicroFrontendNode(divElement, microFrontendProperties)

        expect(divElement.orchyProperties).toBeUndefined()
    })

    it('works if element is a leaf', () => {
        const divElement = document.createElement('div')
        const childElement = document.createElement('div')
        childElement.setAttribute('orchy-micro-frontend', '')
        divElement.appendChild(childElement)

        enrichMicroFrontendNode(divElement, microFrontendProperties)

        expect(divElement.orchyProperties).toBeUndefined()
        expect(childElement.orchyProperties).toBe(microFrontendProperties)
    })
})
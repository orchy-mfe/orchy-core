import {MicroFrontendProperties} from '@orchy-mfe/models'
import {ReplaySubject} from 'rxjs'
import {describe, it, expect, afterEach, vi} from 'vitest'

import MicroFrontendNodeCreator from './MicroFrontendNodeCreator'

describe('MicroFrontendNodeCreator', () => {

    type HTMLElementWithBus =  HTMLElement & {eventBus: ReplaySubject<unknown>, orchyProperties: MicroFrontendProperties}

    const microFrontendProperties: MicroFrontendProperties = {
        baseUrl: '/base',
    }

    afterEach(() => {
        document.head.appendChild = vi.fn()
    })

    it('create tag only', () => {
        const pageCreator = new MicroFrontendNodeCreator({
            type: 'element',
            tag: 'foo-wc'
        }, new ReplaySubject(), microFrontendProperties)

        const createdNode = pageCreator.create() as HTMLElementWithBus

        expect(createdNode.toString()).toEqual('<foo-wc></foo-wc>')
        expect(createdNode.getAttributeNames()).toMatchObject([])
        expect(createdNode.eventBus).toBeDefined()
        expect(createdNode.orchyProperties).toBe(microFrontendProperties)
    })

    it('create tag with url', () => {
        const pageCreator = new MicroFrontendNodeCreator({
            type: 'element',
            tag: 'foo-wc',
            url: 'https://example.com'
        }, new ReplaySubject(), microFrontendProperties)

        const createdNode = pageCreator.create() as HTMLElementWithBus

        expect(createdNode.toString()).toEqual('<foo-wc></foo-wc>')
        expect(document.head.appendChild).toHaveBeenCalledTimes(1)
        expect(createdNode.eventBus).toBeDefined()
        expect(createdNode.orchyProperties).toBe(microFrontendProperties)
    })

    it('correctly apply attributes, properties and orchyProperties', () => {
        const pageCreator = new MicroFrontendNodeCreator({
            type: 'element',
            tag: 'foo-wc',
            attributes: {
                id: 'root',
                style: 'color:red'
            },
            properties: {
                foo: 'goofy'
            }
        }, new ReplaySubject(), microFrontendProperties)

        const createdNode = pageCreator.create() as HTMLElementWithBus & {foo: string}

        expect(createdNode.toString()).toEqual('<foo-wc id="root" style="color:red"></foo-wc>')
        expect(createdNode.style.toString()).toEqual({
            0: 'color',
        }.toString())
        expect(createdNode.id).toEqual('root')
        expect(createdNode.foo).toEqual('goofy')
        expect(createdNode.eventBus).toBeDefined()
        expect(createdNode.orchyProperties).toBe(microFrontendProperties)
    })
})
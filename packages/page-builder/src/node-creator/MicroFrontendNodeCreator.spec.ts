import {MicroFrontendProperties} from '@orchy-mfe/models'
import {ReplaySubject} from 'rxjs'
import {describe, it, expect, afterEach, vi} from 'vitest'

import MicroFrontendNodeCreator from './MicroFrontendNodeCreator'

describe('MicroFrontendNodeCreator', () => {

    type HTMLElementWithBus =  HTMLElement & {eventBus: ReplaySubject<unknown>, orchyProperties: MicroFrontendProperties}

    const subject = new ReplaySubject()

    const microFrontendBaseProperties: MicroFrontendProperties = {
        baseUrl: '/base',
    }

    afterEach(() => {
        document.head.appendChild = vi.fn()
    })

    it('create tag only', () => {
        const pageCreator = new MicroFrontendNodeCreator({
            type: 'element',
            tag: 'foo-wc'
        }, subject, microFrontendBaseProperties)

        const createdNode = pageCreator.create() as HTMLElementWithBus

        expect(createdNode.toString()).toEqual('<foo-wc></foo-wc>')
        expect(createdNode.getAttributeNames()).toMatchObject([])
        expect(createdNode.orchyProperties.eventBus).toBe(subject)
        expect(createdNode.orchyProperties).toMatchObject(microFrontendBaseProperties)
    })

    it('create tag with url', () => {
        const pageCreator = new MicroFrontendNodeCreator({
            type: 'element',
            tag: 'foo-wc',
            url: 'https://example.com'
        }, subject, microFrontendBaseProperties)

        const createdNode = pageCreator.create() as HTMLElementWithBus

        expect(createdNode.toString()).toEqual('<foo-wc></foo-wc>')
        expect(createdNode.orchyProperties.eventBus).toBe(subject)
        expect(createdNode.orchyProperties).toMatchObject(microFrontendBaseProperties)
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
        }, subject, microFrontendBaseProperties)

        const createdNode = pageCreator.create() as HTMLElementWithBus & {foo: string}

        expect(createdNode.toString()).toEqual('<foo-wc id="root" style="color:red"></foo-wc>')
        expect(createdNode.style.toString()).toEqual({
            0: 'color',
        }.toString())
        expect(createdNode.id).toEqual('root')
        expect(createdNode.orchyProperties.foo).toEqual('goofy')
        expect(createdNode.orchyProperties.eventBus).toBe(subject)
        expect(createdNode.orchyProperties.id).toEqual('root')
        expect(createdNode.orchyProperties.style).toEqual('color:red')
        expect(createdNode.orchyProperties).toMatchObject(microFrontendBaseProperties)
    })
})
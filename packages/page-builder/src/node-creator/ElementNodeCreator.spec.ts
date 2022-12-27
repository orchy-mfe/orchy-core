import {ReplaySubject} from 'rxjs'
import {afterEach, describe, expect, it, vi} from 'vitest'

import ElementNodeCreator from './ElementNodeCreator'

describe('ElementNodeCreator', () => {

    type HTMLElementWithBus =  HTMLElement & {eventBus: ReplaySubject<unknown>}

    afterEach(() => {
        document.head.appendChild = vi.fn()
        window.importShim = vi.fn()
    })

    it('create tag only', () => {
        const pageCreator = new ElementNodeCreator({
            type: 'element',
            tag: 'foo-wc'
        }, new ReplaySubject())

        const createdNode = pageCreator.create() as HTMLElementWithBus

        expect(createdNode.toString()).toEqual('<foo-wc></foo-wc>')
        expect(createdNode.getAttributeNames()).toMatchObject([])
        expect(createdNode.eventBus).toBeDefined()
    })

    it('create tag with url', () => {
        const pageCreator = new ElementNodeCreator({
            type: 'element',
            tag: 'foo-wc',
            url: 'https://example.com'
        }, new ReplaySubject())

        const createdNode = pageCreator.create() as HTMLElementWithBus

        expect(createdNode.toString()).toEqual('<foo-wc></foo-wc>')
        expect(createdNode.eventBus).toBeDefined()
        expect(window.importShim).toHaveBeenCalledWith('https://example.com')
    })

    it('correctly apply both attributes and properties', () => {
        const pageCreator = new ElementNodeCreator({
            type: 'element',
            tag: 'foo-wc',
            attributes: {
                id: 'root',
                style: 'color:red'
            },
            properties: {
                foo: 'goofy'
            }
        }, new ReplaySubject())

        const createdNode = pageCreator.create() as HTMLElementWithBus & {foo: string}

        expect(createdNode.toString()).toEqual('<foo-wc id="root" style="color:red"></foo-wc>')
        expect(createdNode.style.toString()).toEqual({
            0: 'color',
        }.toString())
        expect(createdNode.id).toEqual('root')
        expect(createdNode.foo).toEqual('goofy')
        expect(createdNode.eventBus).toBeDefined()
    })
})
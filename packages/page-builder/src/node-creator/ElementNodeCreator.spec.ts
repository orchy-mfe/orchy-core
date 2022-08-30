import { ReplaySubject } from 'rxjs'
import { describe, it, expect, afterEach, vi } from 'vitest'

import ElementNodeCreator from './ElementNodeCreator'

describe('ElementNodeCreator', () => {

    afterEach(() => {
        document.head.appendChild = vi.fn()
    })

    it('create tag only', () => {
        const pageCreator = new ElementNodeCreator({
            type: 'element',
            tag: 'foo-wc'
        }, new ReplaySubject())

        const createdNode = pageCreator.create()

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

        const createdNode = pageCreator.create()

        expect(createdNode.toString()).toEqual('<foo-wc></foo-wc>')
        expect(document.head.appendChild).toHaveBeenCalledTimes(1)
        expect(createdNode.eventBus).toBeDefined()
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

        const createdNode = pageCreator.create()

        expect(createdNode.toString()).toEqual('<foo-wc id="root" style="color:red"></foo-wc>')
        expect(createdNode.style.toString()).toEqual({
            0: 'color',
        }.toString())
        expect(createdNode.id).toEqual('root')
        expect(createdNode.foo).toEqual('goofy')
        expect(createdNode.eventBus).toBeDefined()
    })
})
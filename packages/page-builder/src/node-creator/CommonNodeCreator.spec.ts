import {CommonPageConfiguration} from '@orchy/models'
import {describe, it, expect} from 'vitest'

import CommonNodeCreator from './CommonNodeCreator'

describe('CommonNodeCreator', () => {

    const createPage = (configuration: CommonPageConfiguration) => {
        // eslint-disable-next-line
        // @ts-ignore
        const commonPageCreator = new CommonNodeCreator(configuration)
        commonPageCreator.currentNode = document.createElement('div')

        return commonPageCreator
    }

    it('correctly doest nothing', () => {
        const pageCreator = createPage({})

        const createdNode = pageCreator.create()

        expect(createdNode.toString()).toEqual('<div></div>')
        expect(createdNode.getAttributeNames()).toMatchObject([])
    })

    it('correctly apply not existing attribute', () => {
        const pageCreator = createPage({
            attributes: {
                id: 'root'
            }
        })

        const createdNode = pageCreator.create()

        expect(createdNode.toString()).toEqual('<div id="root"></div>')
        expect(createdNode.id).toEqual('root')
    })

    it('correctly update existing attribute', () => {
        const pageCreator = createPage({
            attributes: {
                style: 'color:red'
            }
        })

        pageCreator.currentNode.setAttribute('style', 'background-color:green')

        const createdNode = pageCreator.create()

        expect(createdNode.toString()).toEqual('<div style="background-color:green;color:red"></div>')
        expect(createdNode.style.toString()).toEqual({
            0: 'background-color',
            1: 'color'
        }.toString())
    })

    it('correctly apply not existing property', () => {
        const pageCreator = createPage({
            properties: {
                foo: 'goofy'
            }
        })

        const createdNode = pageCreator.create()

        expect(createdNode.toString()).toEqual('<div></div>')
        expect(createdNode['foo']).toEqual('goofy')
    })

    it('correctly apply both attributes and properties', () => {
        const pageCreator = createPage({
            attributes: {
                id: 'root',
                style: 'color:red'
            },
            properties: {
                foo: 'goofy'
            }
        })

        const createdNode = pageCreator.create()

        expect(createdNode.toString()).toEqual('<div id="root" style="color:red"></div>')
        expect(createdNode.style.toString()).toEqual({
            0: 'color',
        }.toString())
        expect(createdNode.id).toEqual('root')
        expect(createdNode.foo).toEqual('goofy')
    })
})
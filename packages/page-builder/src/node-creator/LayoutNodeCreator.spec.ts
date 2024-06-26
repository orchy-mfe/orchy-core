import {describe, expect, it} from 'vitest'

import LayoutNodeCreator from './LayoutNodeCreator'


describe('LayoutNodeCreator', () => {

    type HTMLElementWithBus =  HTMLElement & {foo: string}


    it('create flex-column', () => {
        const pageCreator = new LayoutNodeCreator({
            type: 'flex-column'
        })

        const createdNode = pageCreator.create()

        expect(createdNode.toString()).toEqual('<div style="display: flex; flex-direction: column"></div>')
        expect(createdNode.style.toString()).toEqual({
            0: 'display',
            1: 'flex-direction'
        }.toString())
    })

    it('create complete flex-column', () => {
        const pageCreator = new LayoutNodeCreator({
            type: 'flex-column',
            attributes: {
                id: 'root',
                style: 'color:red'
            },
            properties: {
                foo: 'goofy'
            }
        })

        const createdNode = pageCreator.create() as HTMLElementWithBus

        expect(createdNode.toString()).toEqual('<div id="root" style="display: flex; flex-direction: column;color:red"></div>')
        expect(createdNode.style.toString()).toEqual({
            0: 'color',
        }.toString())
        expect(createdNode.id).toEqual('root')
        expect(createdNode.foo).toEqual('goofy')
    })

    it('create flex-row', () => {
        const pageCreator = new LayoutNodeCreator({
            type: 'flex-row'
        })

        const createdNode = pageCreator.create()

        expect(createdNode.toString()).toEqual('<div style="display: flex; flex-direction: row"></div>')
        expect(createdNode.style.toString()).toEqual({
            0: 'display',
            1: 'flex-direction'
        }.toString())
    })

    it('create complete flex-row', () => {
        const pageCreator = new LayoutNodeCreator({
            type: 'flex-row',
            attributes: {
                id: 'root',
                style: 'color:red'
            },
            properties: {
                foo: 'goofy'
            }
        })

        const createdNode = pageCreator.create() as HTMLElementWithBus

        expect(createdNode.toString()).toEqual('<div id="root" style="display: flex; flex-direction: row;color:red"></div>')
        expect(createdNode.style.toString()).toEqual({
            0: 'color',
        }.toString())
        expect(createdNode.id).toEqual('root')
        expect(createdNode.foo).toEqual('goofy')
    })
})
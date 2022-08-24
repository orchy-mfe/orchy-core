import { CommonPageConfiguration } from '@orchy/models'
import {describe, it, expect} from 'vitest'
import CommonPageCreator from './CommonPageCreator'

describe("CommonPageCreator", () => {

    const createPage = (configuration: CommonPageConfiguration) => {
        // eslint-disable-next-line
        // @ts-ignore
        const commonPageCreator = new CommonPageCreator(configuration)
        commonPageCreator.currentNode = document.createElement("div")

        return commonPageCreator
    }

    it("correctly apply not existing attribute", () => {
        const pageCreator = createPage({
            attributes: {
                id: 'root'
            }
        })

        const createdNode = pageCreator.create()

        expect(createdNode.toString()).toEqual('<div id="root"></div>')
        expect(createdNode.id).toEqual('root')
    })

    it("correctly update existing attribute", () => {
        const pageCreator = createPage({
            attributes: {
                style: 'color:red'
            }
        })

        pageCreator.currentNode.setAttribute("style", "background-color:green")

        const createdNode = pageCreator.create()

        expect(createdNode.toString()).toEqual('<div style="background-color:green;color:red"></div>')
        expect(createdNode.style.toString()).toEqual({
            0: 'background-color',
            1: 'color'
        }.toString())
    })

    it("correctly apply not existing property", () => {
        const pageCreator = createPage({
            properties: {
                foo: 'goofy'
            }
        })

        const createdNode = pageCreator.create()

        expect(createdNode.toString()).toEqual('<div></div>')
        expect(createdNode['foo']).toEqual('goofy')
    })
})
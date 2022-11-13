import {describe, it, expect} from 'vitest'

import {pageBuilder} from './PageBuilder'

describe('PageBuilder', () => {
    it('create a full page', () => {

        const pageBuilt = pageBuilder([{
            type: 'flex-column',
            attributes: {
                id: 'column'
            },
            content: [{
                type: 'element',
                tag: 'foo-wc',
                attributes: {
                    id: 'wc'
                }
            }, {
                type: 'micro-frontend',
                tag: 'mfe-wc',
                attributes: {
                    id: 'wc'
                }
            }]
        }], undefined, undefined, {basePath: '/'})

        expect(pageBuilt.toString()).toEqual('<div><div style="display: flex; flex-direction: column" id="column"><foo-wc id="wc"></foo-wc><mfe-wc id="wc"></mfe-wc></div></div>')
        expect(pageBuilt.querySelector('foo-wc')?.eventBus).toBeDefined()
        expect(pageBuilt.querySelector('mfe-wc')?.orchyProperties).toBeDefined()
        expect(pageBuilt.querySelector('mfe-wc')?.orchyProperties.eventBus).toBeDefined()
        expect(pageBuilt.querySelector('#column')?.eventBus).not.toBeDefined()
    })
})
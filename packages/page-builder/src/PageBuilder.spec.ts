import {ReplaySubject} from 'rxjs'
import {describe, expect,it} from 'vitest'

import {pageBuilder} from './PageBuilder'

describe('PageBuilder', () => {
    it('creates a full page with json config', () => {
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
        }], undefined, {basePath: '/', eventBus: new ReplaySubject()})

        expect(pageBuilt.toString()).toEqual('<div><div style="display: flex; flex-direction: column" id="column"><foo-wc id="wc"></foo-wc><mfe-wc id="wc"></mfe-wc></div></div>')
        expect(pageBuilt.querySelector('foo-wc')?.eventBus).toBeDefined()
        expect(pageBuilt.querySelector('mfe-wc')?.orchyProperties).toBeDefined()
        expect(pageBuilt.querySelector('mfe-wc')?.orchyProperties.eventBus).toBeDefined()
        expect(pageBuilt.querySelector('#column')?.eventBus).not.toBeDefined()
    })

    it('creates a full page with string config', () => {
        const pageBuilt = pageBuilder([
            '<div style="display: flex; flex-direction: column" id="column"><foo-wc orchy-element id="wc"></foo-wc><mfe-wc orchy-micro-frontend id="wc"></mfe-wc></div>'
        ], undefined, {basePath: '/', eventBus: new ReplaySubject()})

        expect(pageBuilt.toString()).toEqual('<div><div style="display: flex; flex-direction: column" id="column"><foo-wc id="wc" orchy-element=""></foo-wc><mfe-wc id="wc" orchy-micro-frontend=""></mfe-wc></div></div>')
        expect(pageBuilt.querySelector('foo-wc')?.eventBus).toBeDefined()
        expect(pageBuilt.querySelector('mfe-wc')?.orchyProperties).toBeDefined()
        expect(pageBuilt.querySelector('mfe-wc')?.orchyProperties.eventBus).toBeDefined()
        expect(pageBuilt.querySelector('#column')?.eventBus).not.toBeDefined()
    })

    it('creates a full page mixing config type', () => {
        const pageBuilt = pageBuilder([
            '<div><foo-wc orchy-element></foo-wc><mfe-wc orchy-micro-frontend></mfe-wc></div>',
            {
                type: 'element',
                tag: 'foo-wc-json',
                attributes: {
                    id: 'wc'
                }
            }
        ], undefined, {basePath: '/', eventBus: new ReplaySubject()})

        expect(pageBuilt.toString()).toEqual('<div><div><foo-wc orchy-element=""></foo-wc><mfe-wc orchy-micro-frontend=""></mfe-wc></div><foo-wc-json id="wc"></foo-wc-json></div>')
        expect(pageBuilt.querySelector('foo-wc')?.eventBus).toBeDefined()
        expect(pageBuilt.querySelector('foo-wc-json')?.eventBus).toBeDefined()
        expect(pageBuilt.querySelector('mfe-wc')?.orchyProperties).toBeDefined()
        expect(pageBuilt.querySelector('mfe-wc')?.orchyProperties.eventBus).toBeDefined()
        expect(pageBuilt.querySelector('#column')?.eventBus).not.toBeDefined()
    })
})
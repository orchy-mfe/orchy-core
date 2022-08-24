import {describe, it, expect} from 'vitest'

import {pageBuilder} from './PageBuilder'

describe("PageBuilder", () => {
    it("create a full page", () => {

        const pageBuilt = pageBuilder([{
            type: 'flex-column',
            content: [{
                type: 'element',
                tag: 'foo-wc',
                attributes: {
                    id: "wc"
                }
            }]
        }])

        expect(pageBuilt.toString()).toEqual('<div><div style="display: flex; flex-direction: column"><foo-wc id="wc"></foo-wc></div></div>')

    })
})
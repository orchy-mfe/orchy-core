import {describe, it, expect, vi} from 'vitest'

import {shimImporter} from './ShimImporter'

describe('ShimImporter', () => {
    it('works for no importShim defined', () => {
        const scriptElement = document.createRange().createContextualFragment('<script type="module" src="foo.jsx"></script>')
        shimImporter(scriptElement)

        expect(scriptElement.firstElementChild).not.toBeNull()
    })

    it('work if importShim defined', () => {
        window.importShim = vi.fn()
        const scriptElement = document.createRange().createContextualFragment('<script type="module" src="foo.jsx"></script>')
        
        shimImporter(scriptElement)

        expect(window.importShim).toHaveBeenCalledWith('foo.jsx')
        expect(window.importShim).toHaveBeenCalledTimes(1)
        expect(scriptElement.firstElementChild).toBeNull()
    })

    it('works if script is a leaf', () => {
        window.importShim = vi.fn()
        const scriptElement = document.createRange().createContextualFragment('<div><script type="module" src="fuu.jsx"></script></div>')
        
        shimImporter(scriptElement)

        expect(window.importShim).toHaveBeenCalledWith('fuu.jsx')
        expect(window.importShim).toHaveBeenCalledTimes(1)
        expect(scriptElement.firstElementChild?.firstChild).toBeNull()
    })
})
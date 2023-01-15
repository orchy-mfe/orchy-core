import './index'

import {describe, expect, test} from 'vitest'

describe('history-patcher', () => {
    test('already patched history api', () => {
        expect(window.history.pushState.name).toBe('orchyPatchedState')
        expect(window.history.replaceState.name).toBe('orchyPatchedState')
    })
})
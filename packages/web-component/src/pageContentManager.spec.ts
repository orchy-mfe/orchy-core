import {describe, it, expect, vi} from 'vitest'

import EventBusSubject from './event-bus/EventBusSubject'
import pageContentManagerBuilder from './pageContentManager'

describe('pageContentManager', () => {
    it('correctly invokes setPageContent', () => {
        const setPageContentMock = vi.fn()
        const elementToCreate = document.createElement('div')

        const pageContentManager = pageContentManagerBuilder(setPageContentMock, new EventBusSubject())
        pageContentManager(elementToCreate)

        expect(setPageContentMock).toHaveBeenCalledWith(elementToCreate)
    })
})
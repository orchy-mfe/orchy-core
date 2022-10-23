import {describe, test, expect, vi} from 'vitest'

import EventBusRegistry from './EventBusRegistry'

describe('EventBusRegistry', () => {
    test('return default event bus for missing arg', () => {
        const eventBusRegistry = new EventBusRegistry()

        expect(eventBusRegistry.getBus()).toBeDefined()
    })

    describe('defined discriminator', () => {
        test('return event bus for defined discriminator', () => {
            const eventBusRegistry = new EventBusRegistry()
    
            expect(eventBusRegistry.getBus('foo')).toBeDefined()
        })

        test('return same bus for same discriminator', () => {
            const eventBusRegistry = new EventBusRegistry()
    
            expect(eventBusRegistry.getBus('foo')).toBeDefined()
            expect(eventBusRegistry.getBus('foo')).toBe(eventBusRegistry.getBus('foo'))
        })
    })

    describe('default event bus is different from the discriminated one', () => {
        test('for not empty discriminator', () => {
            const eventBusRegistry = new EventBusRegistry()
        
            const defaultEventBus = eventBusRegistry.getBus()
            const fooEventBus = eventBusRegistry.getBus('foo')

            expect(defaultEventBus).not.toBe(fooEventBus)
        })

        test('for empty discriminator', () => {
            const eventBusRegistry = new EventBusRegistry()
        
            const defaultEventBus = eventBusRegistry.getBus()
            const fooEventBus = eventBusRegistry.getBus('')

            expect(defaultEventBus).not.toBe(fooEventBus)
        })
    })

    test('correctly destroy bus', () => {
        const eventBusRegistry = new EventBusRegistry()
        
        const fooBus = eventBusRegistry.getBus('foo')
        const defaultBus = eventBusRegistry.getBus()

        vi.spyOn(fooBus, 'complete')
        vi.spyOn(defaultBus, 'complete')

        eventBusRegistry.destroyBus()

        expect(fooBus.complete).toHaveBeenCalledTimes(1)
        expect(defaultBus.complete).toHaveBeenCalledTimes(1)
    })

    test('correctly clear bus', () => {
        const eventBusRegistry = new EventBusRegistry()
        
        const fooBus = eventBusRegistry.getBus('foo')
        const defaultBus = eventBusRegistry.getBus()

        vi.spyOn(fooBus, 'clearBuffer')
        vi.spyOn(defaultBus, 'clearBuffer')

        eventBusRegistry.clearBus()

        expect(fooBus.clearBuffer).toHaveBeenCalledTimes(1)
        expect(defaultBus.clearBuffer).toHaveBeenCalledTimes(1)
    })
})
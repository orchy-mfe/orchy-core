import EventBusSubject from './EventBusSubject'

export default class EventBusRegistry {
    private defaultEventBus: EventBusSubject<unknown> = new EventBusSubject()
    private eventBusRegistry: Record<string, EventBusSubject<unknown>> = {}

    public getBus(eventBusDiscriminator?: string): EventBusSubject<unknown> {
        if(eventBusDiscriminator === undefined) return this.defaultEventBus

        return this.getOrCreateBus(eventBusDiscriminator)
    }

    public destroyBus() {
        this.defaultEventBus.complete()
        Object.values(this.eventBusRegistry).forEach(eventBus => eventBus.complete())
    }

    public clearBus() {
        this.defaultEventBus.clearBuffer()
        Object.values(this.eventBusRegistry).forEach(eventBus => eventBus.clearBuffer())
    }

    private getOrCreateBus(eventBusDiscriminator: string): EventBusSubject<unknown> {
        this.eventBusRegistry[eventBusDiscriminator] = this.eventBusRegistry[eventBusDiscriminator] || new EventBusSubject()
        return this.eventBusRegistry[eventBusDiscriminator]
    }
}
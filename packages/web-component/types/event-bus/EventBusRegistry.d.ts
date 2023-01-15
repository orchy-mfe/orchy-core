import EventBusSubject from './EventBusSubject'
export default class EventBusRegistry {
    private defaultEventBus
    private eventBusRegistry
    getBus(eventBusDiscriminator?: string): EventBusSubject<unknown>;
    destroyBus(): void;
    private getOrCreateBus
}

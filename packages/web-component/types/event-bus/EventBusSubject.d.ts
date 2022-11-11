import { ReplaySubject } from 'rxjs';
export default class EventBusSubject<T> extends ReplaySubject<T> {
    clearBuffer(): void;
}

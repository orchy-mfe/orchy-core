import {ReplaySubject} from 'rxjs'

export default class EventBusSubject<T> extends ReplaySubject<T> {
    public clearBuffer(): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this._buffer = []
    }
}
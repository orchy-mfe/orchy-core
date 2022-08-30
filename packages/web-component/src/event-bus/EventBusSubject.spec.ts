import { ReplaySubject } from 'rxjs'
import { describe, it, expect } from 'vitest'

import EventBusSubject from './EventBusSubject'

describe('EventBusSubjector', () => {

    it('should extend Subject', () => {
        const subject = new EventBusSubject()
        expect(subject).to.be.instanceof(ReplaySubject)
    })

    it('Store all values', () => new Promise<void>(complete => {
        const subject = new EventBusSubject<number>()
        const valuesToSend = [1, 2, 3]

        valuesToSend.forEach(value => subject.next(value))

        subject.subscribe({
            next: value => {
                expect(valuesToSend.includes(value)).toBeTruthy()
                if (value === valuesToSend.at(-1)) {
                    subject.complete()
                }
            },
            complete: () => complete()
        })
    }))

    it("Don't emit previous values for cleared buffer", () => new Promise<void>(complete => {
        const subject = new EventBusSubject()
        const valuesToSend = [1, 2, 3]

        valuesToSend.forEach(value => subject.next(value))

        subject.clearBuffer()

        subject.next(true)

        subject.subscribe((wasEmpty) => {
            expect(wasEmpty).toBeTruthy()
            complete()
        })
    }))
})


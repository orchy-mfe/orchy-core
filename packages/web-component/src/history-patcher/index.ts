// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
type StateFunction = (data: unknown, unused: string, url?: string | URL | null) => void

const patchedState = (stateFunction: StateFunction): StateFunction => {
    if(stateFunction.name === 'orchyPatchedState') 
        return stateFunction

    const handler = function orchyPatchedState() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line prefer-rest-params
        stateFunction.apply(this, arguments)
        window.dispatchEvent(new PopStateEvent('popstate', {state: window.history.state}))
    }

    handler.isPatched = true

    return handler
}

window.history.pushState = patchedState(window.history.pushState)
window.history.replaceState = patchedState(window.history.replaceState)
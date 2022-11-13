declare type StateFunction = (data: unknown, unused: string, url?: string | URL | null) => void;
declare const patchedState: (stateFunction: StateFunction) => StateFunction;

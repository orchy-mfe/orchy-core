import {CommonPageConfiguration} from './CommonPageConfiguration'

export type ElementPageConfiguration = CommonPageConfiguration & {
    type: 'element' | 'microfrontend',
    tag: string,
    url?: string
}
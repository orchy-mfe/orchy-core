import {CommonPageConfiguration} from './CommonPageConfiguration'

export type ElementPageConfiguration = CommonPageConfiguration & {
    type: 'element' | 'micro-frontend',
    tag: string,
    url?: string
}
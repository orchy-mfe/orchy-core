import {CommonPageConfiguration} from './CommonPageConfiguration'

export type ElementPageConfiguration = CommonPageConfiguration & {
    type: 'element',
    tag: string,
    url?: string
}
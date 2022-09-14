import {CommonPageConfiguration} from './CommonPageConfiguration'

export type LayoutPageConfiguration = CommonPageConfiguration & {
    type: 'flex-row' | 'flex-column'
}
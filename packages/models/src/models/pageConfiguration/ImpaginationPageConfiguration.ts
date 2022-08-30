import {CommonPageConfiguration} from './CommonPageConfiguration'

export type ImpaginationPageConfiguration = CommonPageConfiguration & {
    type: 'flex-row' | 'flex-column'
}
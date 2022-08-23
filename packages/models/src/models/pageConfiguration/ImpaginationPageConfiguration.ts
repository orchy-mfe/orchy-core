import { CommonPageConfiguration } from "./CommonPageConfiguration"

export type ImpaginationPageConfiguration = CommonPageConfiguration & {
    type: 'row' | 'column'
}
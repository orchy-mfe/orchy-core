import {ElementPageConfiguration} from './ElementPageConfiguration'
import {LayoutPageConfiguration} from './ImpaginationPageConfiguration'

type PageConfigurationContent = {
    content?: PageConfiguration[]
}

export type PageConfiguration = (ElementPageConfiguration | LayoutPageConfiguration) & PageConfigurationContent

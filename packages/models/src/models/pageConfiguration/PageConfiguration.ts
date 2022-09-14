import {ElementPageConfiguration} from './ElementPageConfiguration'
import {LayoutPageConfiguration} from './LayoutPageConfiguration'

type PageConfigurationContent = {
    content?: PageConfiguration[]
}

export type PageConfiguration = (ElementPageConfiguration | LayoutPageConfiguration) & PageConfigurationContent

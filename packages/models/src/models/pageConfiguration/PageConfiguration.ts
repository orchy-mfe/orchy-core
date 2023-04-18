import {ElementPageConfiguration} from './ElementPageConfiguration'
import {LayoutPageConfiguration} from './LayoutPageConfiguration'
import {SsrMicroFrontendConfiguration} from './SsrMicroFrontendConfiguration'

type PageConfigurationContent = {
    content?: PageConfiguration[]
}

export type PageConfiguration = (ElementPageConfiguration | LayoutPageConfiguration | SsrMicroFrontendConfiguration) & PageConfigurationContent

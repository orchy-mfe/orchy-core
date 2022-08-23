import { ElementPageConfiguration } from "./ElementPageConfiguration"
import { ImpaginationPageConfiguration } from "./ImpaginationPageConfiguration"

type PageConfigurationContent = {
    content?: PageConfiguration
}

export type PageConfiguration = (ElementPageConfiguration | ImpaginationPageConfiguration) & PageConfigurationContent

import {CommonPageConfiguration} from './CommonPageConfiguration'

export type SsrMicroFrontendConfiguration = CommonPageConfiguration & {
    type: 'ssr-micro-frontend',
    url: string
}
import {MicroPage} from '../configuration'

type AdditionalProperties = {
    baseUrl: string,
}

export type MicroFrontendProperties = MicroPage['properties'] & AdditionalProperties

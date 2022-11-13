import {MicroPage} from '../configuration'

type AdditionalProperties = {
    basePath: string,
}

export type MicroFrontendProperties = MicroPage['properties'] & AdditionalProperties
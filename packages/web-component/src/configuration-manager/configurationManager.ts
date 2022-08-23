import { Configuration } from "@orchy/models"

interface ConfigurationManager {
    retrieveConfiguration: (configurationName: string) => Promise<Configuration>
    abortRetrieve: () => void
}

export default ConfigurationManager
import { Configuration } from "@orchy/models"

type ConfigurationRetriever = (configurationName: string) => Promise<Configuration>

export default ConfigurationRetriever
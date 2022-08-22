import ConfigurationRetriever from './configurationRetriever'

const CONFIGURATION_API = '/api/v1/configuration'

const httpConfigurationRetriever: ConfigurationRetriever = async (configurationName) => {
    const configurationPath = `${CONFIGURATION_API}/${configurationName}.json`
    const configurationResponse = await fetch(configurationPath)
    return configurationResponse.json()
}

export default httpConfigurationRetriever
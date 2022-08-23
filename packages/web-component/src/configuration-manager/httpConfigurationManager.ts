import ConfigurationManager from './configurationManager'

const CONFIGURATION_API = '/api/v1/configuration'

class HttpConfigurationManager implements ConfigurationManager {

    private abortController = new AbortController()

    public async retrieveConfiguration<T>(configurationName: string): Promise<T> {
        const configurationPath = `${CONFIGURATION_API}/${configurationName}.json`
        const configurationResponse = await fetch(configurationPath, {signal: this.abortController.signal})
        return configurationResponse.json()
    }

    public abortRetrieve(): void {
        this.abortController.abort()
    }
}

export default HttpConfigurationManager
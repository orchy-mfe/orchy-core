import ConfigurationClient from './configurationClient'

const CONFIGURATION_API = '/api/v1/configuration'

class HttpConfigurationClient implements ConfigurationClient {

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

export default HttpConfigurationClient
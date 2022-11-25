import ConfigurationClient from './configurationClient'

const CONFIGURATION_API = '/api/v1/configuration'
const JSON_CONTENT_TYPE = 'application/json'

class HttpConfigurationClient implements ConfigurationClient {
    private abortController = new AbortController()

    public async retrieveConfiguration<T>(configurationName: string): Promise<T> {
        this.abortController = new AbortController()
        const configurationPath = `${CONFIGURATION_API}/${configurationName}`
        const configurationResponse = await fetch(configurationPath, {signal: this.abortController.signal})
        const contentType = configurationResponse.headers.get('content-type')
        return contentType?.includes(JSON_CONTENT_TYPE) ? configurationResponse.json() : configurationResponse.text()
    }

    public abortRetrieve(): void {
        this.abortController.abort()
    }
}

export default HttpConfigurationClient
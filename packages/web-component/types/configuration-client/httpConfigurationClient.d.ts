import ConfigurationClient from './configurationClient'
declare class HttpConfigurationClient implements ConfigurationClient {
    private abortController
    retrieveConfiguration<T>(configurationName: string): Promise<T | string>;
    abortRetrieve(): void;
}
export default HttpConfigurationClient

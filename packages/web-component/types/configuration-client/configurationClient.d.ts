interface ConfigurationClient {
    retrieveConfiguration<T>(configurationName: string): Promise<T>;
    abortRetrieve(): void;
}
export default ConfigurationClient;

interface ConfigurationClient {
    retrieveConfiguration<T>(configurationName: string): Promise<T | string>
    abortRetrieve(): void
}

export default ConfigurationClient
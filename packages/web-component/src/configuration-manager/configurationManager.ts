interface ConfigurationManager {
    retrieveConfiguration<T>(configurationName: string): Promise<T>
    abortRetrieve(): void
}

export default ConfigurationManager
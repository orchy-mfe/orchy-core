import { Configuration, PageConfiguration } from '@orchy/models'
import Navigo, { Match } from 'navigo'
import { afterAll, describe, expect, it, vi } from 'vitest'
import { loadMicroApp } from 'qiankun'

import ConfigurationClient from './configuration-client/configurationClient'
import configurationRegister from './configurationRegister'

const testPageConfiguration: PageConfiguration = {
    "type": "element",
    "tag": "div",
    "attributes": {
        "id": "testPageConfiguration"
    }
}

class TestClient implements ConfigurationClient {
    retrieveConfiguration<PageConfiguration>(): Promise<PageConfiguration> {
        return Promise.resolve(testPageConfiguration) as unknown as Promise<PageConfiguration>
    }
    abortRetrieve = vi.fn()
}

const waitFor = (milliseconds = 0) => new Promise(resolve => setTimeout(resolve, milliseconds))


describe("configurationRegister", () => {
    vi.mock('qiankun', () => ({
        ...vi.importActual('qiankun'),
        loadMicroApp: vi.fn()
    }))

    afterAll(() => {
        vi.restoreAllMocks()
    })

    describe("single application in single microfrontend", () => {
        const testConfigurationBuilder: (pageConfiguration?: string, applicationContainer?: string) => Configuration = (pageConfiguration?: string, applicationContainer?: string) => ({
            "microFrontends": {
                "/route/load": {
                    "pageConfiguration": pageConfiguration,
                    "applications": [
                        {
                            "entryPoint": "//localhost:3001",
                            "id": "microfrontend-test-1",
                            "properties": {
                                "mfName": "Name test"
                            },
                            "container": applicationContainer
                        }
                    ]
                }
            }
        })

        const setPageContent = vi.fn()

        const makeChecks = async (configuration, container = 'testPageConfiguration') => {
            expect(configuration.client.abortRetrieve).toHaveBeenCalledTimes(1)

            await waitFor()

            expect(setPageContent).toHaveBeenCalledTimes(1)
            expect(setPageContent.mock.calls[0][0].toString()).toEqual(`<div><div id="${container}"></div></div>`)

            expect(loadMicroApp).toHaveBeenCalledTimes(1)
            expect(loadMicroApp).toHaveBeenCalledWith(expect.objectContaining({
                name: 'microfrontend-test-1',
                entry: '//localhost:3001',
                container: '#root'
            }))
            expect(loadMicroApp.mock.calls[0][0].props.eventBus).toBeDefined()

        }

        it("correctly register configuration", () => {
            const configuration = {
                content: testConfigurationBuilder('page-configuration'),
                client: new TestClient()
            }
            const setPageContent = vi.fn()
            expect(
                () => configurationRegister(configuration, new Navigo('/'), setPageContent)
            ).not.toThrow()
        })

        it("correctly handle current route", () => new Promise<void>(resolve => {
            const configuration = {
                content: testConfigurationBuilder('page-configuration'),
                client: new TestClient()
            }
            window.location.href = '/route/load'

            const router = new Navigo('/')

            router.hooks({
                async after() {
                    await makeChecks(configuration)
                    resolve()
                }
            })

            configurationRegister(configuration, router, setPageContent)
        }))

        it("correctly handle navigated route", () => new Promise<void>(resolve => {
            const configuration = {
                content: testConfigurationBuilder('page-configuration'),
                client: new TestClient()
            }
            const router = new Navigo('/')

            router.hooks({
                async after(match: Match) {
                    if (match.url === 'route/load') {
                        await makeChecks(configuration)

                        resolve()
                    }
                }
            })

            configurationRegister(configuration, router, setPageContent)

            window.location.href = '/route/load'
        }))

        it("correctly handle optional custom container", () => new Promise<void>(resolve => {
            const configuration = {
                content: testConfigurationBuilder('page-configuration', '#custom-container'),
                client: new TestClient()
            }
            window.location.href = '/route/load'

            const router = new Navigo('/')

            router.hooks({
                async after() {
                    await makeChecks(configuration)

                    resolve()
                }
            })

            configurationRegister(configuration, router, setPageContent)
        }))

        it("correctly handle default page configuration", () => new Promise<void>(resolve => {
            const configuration = {
                content: testConfigurationBuilder(),
                client: new TestClient()
            }
            window.location.href = '/route/load'

            const router = new Navigo('/')

            router.hooks({
                async after() {
                    await makeChecks(configuration, 'root')

                    resolve()
                }
            })

            configurationRegister(configuration, router, setPageContent)
        }))

    })

    describe("multiple applications in single microfrontend", () => {
        const testConfigurationBuilder: (application1Container?: string, application2Container?: string) => Configuration =
            (application1Container?: string, application2Container?: string) => ({
                "microFrontends": {
                    "/route/load": {
                        "pageConfiguration": "page-config",
                        "applications": [
                            {
                                "entryPoint": "//localhost:3001",
                                "id": "microfrontend-test-1",
                                "properties": {
                                    "mfName": "Name test"
                                },
                                "container": application1Container
                            },
                            {
                                "entryPoint": "//localhost:3001",
                                "id": "microfrontend-test-2",
                                "properties": {
                                    "mfName": "Name test"
                                },
                                "container": application2Container
                            }
                        ]
                    }
                }
            })

        const setPageContent = vi.fn()

        const makeChecks = async (configuration) => {
            expect(configuration.client.abortRetrieve).toHaveBeenCalledTimes(1)

            await waitFor()

            expect(setPageContent).toHaveBeenCalledTimes(1)
            expect(setPageContent.mock.calls[0][0].toString()).toEqual('<div><div id="testPageConfiguration"></div></div>')

            expect(loadMicroApp).toHaveBeenCalledTimes(2)
            expect(loadMicroApp).toHaveBeenNthCalledWith(1, expect.objectContaining({
                name: 'microfrontend-test-1',
                entry: '//localhost:3001',
                container: 'container1'
            }))
            expect(loadMicroApp).toHaveBeenNthCalledWith(2, expect.objectContaining({
                name: 'microfrontend-test-2',
                entry: '//localhost:3001',
                container: 'container2'
            }))

            expect(loadMicroApp.mock.calls[0][0].props.eventBus).toBeDefined()
            expect(loadMicroApp.mock.calls[1][0].props.eventBus).toBeDefined()
        }

        it("correctly reject for missing first container", () => {
            const configuration = {
                content: testConfigurationBuilder(),
                client: new TestClient()
            }
            expect(
                () => configurationRegister(configuration, new Navigo('/'), setPageContent)
            ).toThrow(new Error(`Invalid container configuration for application id microfrontend-test-1`))
        })

        it("correctly reject for missing second container", () => {
            const configuration = {
                content: testConfigurationBuilder('container1'),
                client: new TestClient()
            }
            expect(
                () => configurationRegister(configuration, new Navigo('/'), setPageContent)
            ).toThrow(new Error(`Invalid container configuration for application id microfrontend-test-2`))
        })

        it("correctly handle current route", () => new Promise<void>(resolve => {
            const configuration = {
                content: testConfigurationBuilder('container1', 'container2'),
                client: new TestClient()
            }
            window.location.href = '/route/load'

            const router = new Navigo('/')

            router.hooks({
                async after() {
                    await makeChecks(configuration)

                    resolve()
                }
            })

            configurationRegister(configuration, router, setPageContent)
        }))

        it("correctly handle navigated route", () => new Promise<void>(resolve => {
            const configuration = {
                content: testConfigurationBuilder('container1', 'container2'),
                client: new TestClient()
            }

            const router = new Navigo('/')

            router.hooks({
                async after(match: Match) {
                    if (match.url === 'route/load') {
                        await makeChecks(configuration)

                        resolve()
                    }
                }
            })

            configurationRegister(configuration, router, setPageContent)

            window.location.href = '/route/load'
        }))
    })

    describe("multiple microfrontend", () => {
        const testConfiguration = {
            "microFrontends": {
                "/route/load": {
                    "pageConfiguration": 'page-configuration',
                    "applications": [
                        {
                            "entryPoint": "//localhost:3001",
                            "id": "microfrontend-test-1",
                            "properties": {
                                "mfName": "Name test"
                            },
                        }
                    ]
                },
                "/route/alternative": {
                    "pageConfiguration": 'page-configuration',
                    "applications": [
                        {
                            "entryPoint": "//localhost:3002",
                            "id": "microfrontend-test-2",
                            "properties": {
                                "mfName": "Name test 2"
                            },
                        }
                    ]
                }
            }
        }

        const configuration = {
            content: testConfiguration,
            client: new TestClient()
        }
        const setPageContent = vi.fn()

        const checkFirstRoute = async () => {
            expect(configuration.client.abortRetrieve).toHaveBeenCalledTimes(1)

            await waitFor()

            expect(setPageContent).toHaveBeenCalledTimes(1)
            expect(setPageContent.mock.calls[0][0].toString()).toEqual('<div><div id="testPageConfiguration"></div></div>')

            expect(loadMicroApp).toHaveBeenCalledTimes(1)
            expect(loadMicroApp).toHaveBeenCalledWith(expect.objectContaining({
                name: 'microfrontend-test-1',
                entry: '//localhost:3001',
                container: '#root'
            }))
            expect(loadMicroApp.mock.calls[0][0].props.eventBus).toBeDefined()
        }

        const checkSecondRoute = async (calledTimes) => {
            expect(configuration.client.abortRetrieve).toHaveBeenCalledTimes(calledTimes)

            await waitFor()

            expect(setPageContent).toHaveBeenCalledTimes(calledTimes)
            expect(setPageContent.mock.calls[0][0].toString()).toEqual('<div><div id="testPageConfiguration"></div></div>')

            expect(loadMicroApp).toHaveBeenCalledTimes(calledTimes)
            expect(loadMicroApp).toHaveBeenCalledWith(expect.objectContaining({
                name: 'microfrontend-test-2',
                entry: '//localhost:3002',
                container: '#root'
            }))
            expect(loadMicroApp.mock.calls[calledTimes - 1][0].props.eventBus).toBeDefined()
        }

        it("correctly register configuration", () => {
            const setPageContent = vi.fn()
            expect(
                () => configurationRegister(configuration, new Navigo('/'), setPageContent)
            ).not.toThrow()
        })

        it("correctly handle first route", () => new Promise<void>(resolve => {
            window.location.href = '/route/load'

            const router = new Navigo('/')

            router.hooks({
                async after() {
                    await checkFirstRoute()
                    resolve()
                }
            })

            configurationRegister(configuration, router, setPageContent)
        }))

        it("correctly handle second route", () => new Promise<void>(resolve => {
            window.location.href = '/route/alternative'

            const router = new Navigo('/')

            router.hooks({
                async after() {
                    await checkSecondRoute(1)
                    resolve()
                }
            })

            configurationRegister(configuration, router, setPageContent)
        }))

        it("correctly handle navigation route", () => new Promise<void>(resolve => {
            window.location.href = '/route/load'

            const router = new Navigo('/')

            router.hooks({
                async after(match: Match) {
                    if (match.url === 'route/load') {
                        await checkFirstRoute()

                        router.navigate('/route/alternative')
                    }
                    else if (match.url === 'route/alternative') {
                        await checkSecondRoute(2)

                        resolve()
                    }
                }
            })

            configurationRegister(configuration, router, setPageContent)
        }))
    })
})
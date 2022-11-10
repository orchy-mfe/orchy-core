import {Configuration, PageConfiguration} from '@orchy-mfe/models'
import {Match} from 'navigo'
import {afterAll, describe, expect, it, vi} from 'vitest'

import ConfigurationClient from './configuration-client/configurationClient'
import configurationRegister from './configurationRegister'
import addImportMap from './importMap'
import WebComponentState from './web-component-state'

const testPageConfiguration: PageConfiguration = {
    type: 'element',
    tag: 'div',
    attributes: {
        id: 'testPageConfiguration'
    }
}

class TestClient implements ConfigurationClient {
    retrieveConfiguration<PageConfiguration>(): Promise<PageConfiguration> {
        return Promise.resolve(testPageConfiguration) as unknown as Promise<PageConfiguration>
    }
    abortRetrieve = vi.fn()
}

const waitFor = (milliseconds = 0) => new Promise(resolve => setTimeout(resolve, milliseconds))

describe('configurationRegister', () => {
    vi.mock('qiankun', () => ({
        loadMicroApp: vi.fn(),
        prefetchApps: vi.fn()
    }))

    vi.mock('./importMap', () => ({
        default: vi.fn()
    }))

    afterAll(() => {
        vi.restoreAllMocks()
    })

    describe('single application in single microfrontend', () => {
        const testConfigurationBuilder: (pageConfiguration?: string, applicationContainer?: string) => Configuration = (pageConfiguration?: string) => ({
            microPages: {
                '/route/load': {
                    pageConfiguration: pageConfiguration,
                    properties: {
                        pageName: 'Page test'
                    },
                }
            },
            common: {
                importMap: {
                    imports: {
                        test: '/test.js'
                    }
                },
                stylesheets: [
                    'https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css'
                ],
            }
        })

        const makeChecks = async (configuration) => {
            expect(configuration.client.abortRetrieve).toHaveBeenCalledTimes(1)

            await waitFor()

            expect(document.body.replaceChildren).toHaveBeenCalledTimes(1)
            expect(document.body.replaceChildren.mock.calls[0][0].toString()).toEqual('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css">')
            
            expect(addImportMap).toHaveBeenCalledTimes(1)
            expect(addImportMap).toHaveBeenCalledWith(configuration.content)
        }

        it('correctly register configuration', () => {
            const configuration = {
                content: testConfigurationBuilder('page-configuration'),
                client: new TestClient()
            }

            const webComponentState = new WebComponentState(document.body, '/')
            expect(
                () => configurationRegister(configuration, webComponentState)
            ).not.toThrow()
        })

        it('correctly handle current route', () => new Promise<void>(resolve => {
            const configuration = {
                content: testConfigurationBuilder('page-configuration'),
                client: new TestClient()
            }
            window.location.href = '/route/load'

            document.body.replaceChildren = vi.fn()
            const webComponentState = new WebComponentState(document.body, '/')
            webComponentState.router.hooks({
                async after() {
                    await makeChecks(configuration)
                    resolve()
                }
            })

            configurationRegister(configuration, webComponentState)
        }))

        it('correctly handle navigated route', () => new Promise<void>(resolve => {
            const configuration = {
                content: testConfigurationBuilder('page-configuration'),
                client: new TestClient()
            }

            document.body.replaceChildren = vi.fn()
            const webComponentState = new WebComponentState(document.body, '/')
            webComponentState.router.hooks({
                async after(match: Match) {
                    if (match.url === 'route/load') {
                        await makeChecks(configuration)

                        resolve()
                    }
                }
            })

            configurationRegister(configuration, webComponentState)

            window.location.href = '/route/load'
        }))
    })

    describe('multiple applications in single microfrontend', () => {
        const testConfigurationBuilder: (application1Container?: string, application2Container?: string) => Configuration =
            (application1Container?: string, application2Container?: string) => ({
                microPages: {
                    '/route/load': {
                        pageConfiguration: 'page-config',
                        microFrontends: [
                            {
                                entryPoint: '//localhost:3001',
                                id: 'microfrontend-test-1',
                                properties: {
                                    mfName: 'Name test'
                                },
                                container: application1Container
                            },
                            {
                                entryPoint: '//localhost:3002',
                                id: 'microfrontend-test-2',
                                properties: {
                                    mfName: 'Name test 2'
                                },
                                container: application2Container
                            }
                        ],
                        properties: {
                            pageName: 'Page test'
                        },
                    }
                }
            })

        const makeChecks = async (configuration) => {
            expect(configuration.client.abortRetrieve).toHaveBeenCalledTimes(1)

            await waitFor()

            expect(document.body.replaceChildren).toHaveBeenCalledTimes(1)
            expect(document.body.replaceChildren.mock.calls[0][0].toString()).toEqual('<div id="testPageConfiguration"></div>')
        }

        it('correctly handle current route', () => new Promise<void>(resolve => {
            const configuration = {
                content: testConfigurationBuilder('container1', 'container2'),
                client: new TestClient()
            }
            window.location.href = '/route/load'

            document.body.replaceChildren = vi.fn()
            const webComponentState = new WebComponentState(document.body, '/')
            webComponentState.router.hooks({
                async after() {
                    await makeChecks(configuration)

                    resolve()
                }
            })

            configurationRegister(configuration, webComponentState)
        }))

        it('correctly handle navigated route', () => new Promise<void>(resolve => {
            const configuration = {
                content: testConfigurationBuilder('container1', 'container2'),
                client: new TestClient()
            }

            document.body.replaceChildren = vi.fn()
            const webComponentState = new WebComponentState(document.body, '/')
            webComponentState.router.hooks({
                async after(match: Match) {
                    if (match.url === 'route/load') {
                        await makeChecks(configuration)

                        resolve()
                    }
                }
            })

            configurationRegister(configuration, webComponentState)

            window.location.href = '/route/load'
        }))
    })

    describe('multiple microfrontend', () => {
        const testConfiguration = {
            microPages: {
                '/route/load': {
                    pageConfiguration: 'page-configuration',
                    microFrontends: [
                        {
                            entryPoint: '//localhost:3001',
                            id: 'microfrontend-test-1',
                            properties: {
                                mfName: 'Name test'
                            },
                        }
                    ],
                    properties: {
                        pageName: 'Page test'
                    },
                },
                '/route/alternative': {
                    pageConfiguration: 'page-configuration',
                    microFrontends: [
                        {
                            entryPoint: '//localhost:3002',
                            id: 'microfrontend-test-2',
                            properties: {
                                mfName: 'Name test 2'
                            },
                        }
                    ],
                    properties: {
                        pageName: 'Page test 2'
                    },
                }
            }
        }

        const configuration = {
            content: testConfiguration,
            client: new TestClient()
        }

        const checkFirstRoute = async () => {
            expect(configuration.client.abortRetrieve).toHaveBeenCalledTimes(1)

            await waitFor()

            expect(document.body.replaceChildren).toHaveBeenCalledTimes(1)
            expect(document.body.replaceChildren.mock.calls[0][0].toString()).toEqual('<div id="testPageConfiguration"></div>')

            expect(addImportMap).toHaveBeenCalledTimes(1)
            expect(addImportMap).toHaveBeenCalledWith(configuration.content)
        }

        const checkSecondRoute = async (calledTimes) => {
            expect(configuration.client.abortRetrieve).toHaveBeenCalledTimes(calledTimes)

            await waitFor()

            expect(document.body.replaceChildren).toHaveBeenCalledTimes(calledTimes)
            expect(document.body.replaceChildren.mock.calls[0][0].toString()).toEqual('<div id="testPageConfiguration"></div>')

            expect(addImportMap).toHaveBeenCalledTimes(1)
            expect(addImportMap).toHaveBeenCalledWith(configuration.content)
        }

        it('correctly register configuration', () => {
            const webComponentState = new WebComponentState(document.body, '/')
            expect(
                () => configurationRegister(configuration, webComponentState)
            ).not.toThrow()
        })

        it('correctly handle first route', () => new Promise<void>(resolve => {
            window.location.href = '/route/load'

            document.body.replaceChildren = vi.fn()
            const webComponentState = new WebComponentState(document.body, '/')
            webComponentState.router.hooks({
                async after() {
                    await checkFirstRoute()
                    resolve()
                }
            })

            configurationRegister(configuration, webComponentState)
        }))

        it('correctly handle second route', () => new Promise<void>(resolve => {
            window.location.href = '/route/alternative'

            document.body.replaceChildren = vi.fn()
            const webComponentState = new WebComponentState(document.body, '/')
            webComponentState.router.hooks({
                async after() {
                    await checkSecondRoute(1)
                    resolve()
                }
            })

            configurationRegister(configuration, webComponentState)
        }))

        it('correctly handle navigation route', () => new Promise<void>(resolve => {
            window.location.href = '/route/load'

            document.body.replaceChildren = vi.fn()
            const webComponentState = new WebComponentState(document.body, '/')
            webComponentState.router.hooks({
                async after(match: Match) {
                    if (match.url === 'route/load') {
                        await checkFirstRoute()

                        webComponentState.router.navigate('/route/alternative')
                    }
                    else if (match.url === 'route/alternative') {
                        await checkSecondRoute(2)

                        resolve()
                    }
                }
            })

            configurationRegister(configuration, webComponentState)
        }))
    })
})
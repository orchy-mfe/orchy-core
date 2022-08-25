import { Configuration, PageConfiguration } from '@orchy/models'
import Navigo from 'navigo'
import { afterAll, describe, expect, it, vi } from 'vitest'
import { loadMicroApp } from 'qiankun'

import ConfigurationClient from './configuration-client/configurationClient'
import configurationRegister from './configurationRegister'

const testPageConfiguration: PageConfiguration = {
    "type": "element",
    "tag": "div",
    "attributes": {
        "id": "root"
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
    describe("single microfrontend", () => {

        vi.mock('qiankun', () => ({
            ...vi.importActual('qiankun'),
            loadMicroApp: vi.fn()
        }))

        afterAll(() => {
            vi.restoreAllMocks()
        })

        const testConfiguration: Configuration = {
            "microFrontends": {
                "/route/load": {
                    "pageConfiguration": "page-config",
                    "applications": [
                        {
                            "entryPoint": "//localhost:3001",
                            "id": "microfrontend-test-1",
                            "properties": {
                                "mfName": "Name test"
                            }
                        }
                    ]
                }
            },
            "common": {
                "stylesheets": [
                    "https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css"
                ],
                "importMap": {
                    "lodash": "https://unpkg.com/lodash@4.17.21/lodash.js"
                }
            }
        }

        it("correctly register configuration", () => {
            const configuration = {
                content: testConfiguration,
                client: new TestClient()
            }
            const setPageContent = vi.fn()
            expect(
                () => configurationRegister(configuration, new Navigo('/'), setPageContent)
            ).not.toThrow()
        })

        it("correctly handle already defined route", () => new Promise<void>(resolve => {
            const configuration = {
                content: testConfiguration,
                client: new TestClient()
            }
            const setPageContent = vi.fn()
            window.location.href = '/route/load'
            
            const router = new Navigo('/')

            router.hooks({
                async after() {
                    expect(configuration.client.abortRetrieve).toHaveBeenCalledTimes(1)

                    await waitFor()

                    expect(setPageContent).toHaveBeenCalledTimes(1)
                    expect(setPageContent.mock.calls[0][0].toString()).toEqual('<div><div id="root"></div></div>')

                    expect(loadMicroApp).toHaveBeenCalledTimes(1)
                    expect(loadMicroApp).toHaveBeenCalledWith(expect.objectContaining({
                        name: 'microfrontend-test-1',
                        entry: '//localhost:3001',
                        container: '#root'
                    }))
                    expect(loadMicroApp.mock.calls[0][0].props.eventBus).toBeDefined()

                    resolve()
                }
              })

            configurationRegister(configuration, router, setPageContent)
        }))
        
    })
})
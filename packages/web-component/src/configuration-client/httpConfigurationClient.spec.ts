import { describe, it, expect, vi } from 'vitest'
import { Configuration } from '@orchy/models'

import HttpConfigurationClient from './httpConfigurationClient'

const mockConfig: Configuration = {
  "microFrontends": {
    "/route/load": {
      "pageConfiguration": "page-config",
      "applications": [{
        "entryPoint": "//localhost:3001",
        "id": "microfrontend-test-1",
        "properties": {
          "mfName": "Name test"
        }
      }]
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

describe('httpConfigurationRetriever', () => {

  const httpConfigurationManager = new HttpConfigurationClient()
  const fetchOptions = { signal: new AbortController().signal }

  it('correctly return wanted configuration', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchSpy.mockImplementation(() => Promise.resolve({ json: () => mockConfig }))
    const response = await httpConfigurationManager.retrieveConfiguration('test-configuration')

    expect(response).toMatchObject(mockConfig)
    expect(fetchSpy.mock.calls[0][0]).toBe('/api/v1/configuration/test-configuration.json')
    expect(fetchSpy.mock.calls[0][1]).toMatchObject(fetchOptions)

  })

  it('correctly reject for missing configuration', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    fetchSpy.mockImplementation(() => Promise.reject(new Error('file not found')))

    await expect(httpConfigurationManager.retrieveConfiguration('missing-configuration')).rejects.toThrow('file not found')
    expect(fetchSpy.mock.calls[0][0]).toBe('/api/v1/configuration/missing-configuration.json')
    expect(fetchSpy.mock.calls[0][1]).toMatchObject(fetchOptions)
  })
})
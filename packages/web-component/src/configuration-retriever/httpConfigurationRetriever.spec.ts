import {describe, it, beforeAll, afterAll, expect} from 'vitest'
import { Configuration } from '@orchy/models'

import httpConfigurationRetriever from './httpConfigurationRetriever'

const mockConfig: Configuration = {
  "microFrontends": {
    "/route/load": {
      "pageConfiguration": "page-config-initial",
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

  const initialFetch = globalThis.fetch
  
  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.fetch = (endpoint: string) => endpoint === '/api/v1/configuration/test-configuration.json'
      ? Promise.resolve({ json: () => mockConfig }) : Promise.reject(new Error('file not found'))
  })

  afterAll(() => {
    globalThis.fetch = initialFetch
  })

  it('correctly return wanted configuration', async () => {
    const response = await httpConfigurationRetriever('test-configuration')

    expect(response).toMatchObject(mockConfig)
  })

  it('correctly reject for missing configuration', async () => {
    await expect(httpConfigurationRetriever('missing-configuration')).rejects.toThrow('file not found')
  })
})
import {describe, it, expect, vi} from 'vitest'
import {Configuration} from '@orchy-mfe/models'

import HttpConfigurationClient from './httpConfigurationClient'

const mockConfig: Configuration = {
  microPages: {
    '/route/load': {
      pageConfiguration: 'page-config'
    }
  },
  common: {
    stylesheets: [
      'https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css'
    ],
    importMap: {
      imports: {
        react: 'https://unpkg.com/react@18.2.0/index.js'
      }
    }
  }
}

describe('httpConfigurationRetriever', () => {

  const httpConfigurationManager = new HttpConfigurationClient()
  const fetchOptions = {signal: new AbortController().signal}

  it('correctly return wanted configuration', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchSpy.mockImplementation(() => Promise.resolve({json: () => mockConfig}))
    const response = await httpConfigurationManager.retrieveConfiguration('test-configuration.json')

    expect(response).toMatchObject(mockConfig)
    expect(fetchSpy.mock.calls[0][0]).toBe('/api/v1/configuration/test-configuration.json')
    expect(fetchSpy.mock.calls[0][1]).toMatchObject(fetchOptions)

  })

  it('correctly reject for missing configuration', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    fetchSpy.mockImplementation(() => Promise.reject(new Error('file not found')))

    await expect(httpConfigurationManager.retrieveConfiguration('missing-configuration.html')).rejects.toThrow('file not found')
    expect(fetchSpy.mock.calls[0][0]).toBe('/api/v1/configuration/missing-configuration.html')
    expect(fetchSpy.mock.calls[0][1]).toMatchObject(fetchOptions)
  })
})
import chai, { expect, assert } from '@esm-bundle/chai'
import chaiAsPromised from '@esm-bundle/chai-as-promised'
import { Configuration } from '@orchy/models';

import httpConfigurationRetriever from './httpConfigurationRetriever';

chai.use(chaiAsPromised)

const mockConfig: Configuration = {
  "microFrontends": [
    {
      "entryPoints": [
        "https://test.com"
      ],
      "id": "microfrontend-test-1",
      "route": "/route/load",
      "pageConfiguration": "page-config-initial",
      "properties": {
        "mfName": "Name test"
      }
    }
  ],
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

  let initialFetch = globalThis.fetch
  
  before(() => {
    // @ts-ignore
    globalThis.fetch = (endpoint: string) => endpoint === '/api/v1/configuration/test-configuration.json'
      ? Promise.resolve({ json: () => mockConfig }) : Promise.reject()
  })

  after(() => {
    globalThis.fetch = initialFetch
  })

  it('correctly return wanted configuration', async () => {
    const response = await httpConfigurationRetriever('test-configuration')

    expect(response).to.deep.equal(mockConfig)
  });

  it('correctly reject for missing configuration', () => {
    assert.isRejected(httpConfigurationRetriever('missing-configuration'))
  });
});
import { Configuration } from '@orchy/models'
import { describe, it, expect, vi } from 'vitest'

import importMap from './importMap'

describe("importMap", () => {
    const importMapContent = {
        "imports": {
            "react": "https://ga.jspm.io/npm:react@18.0.0-rc.0/index.js"
        },
        "scopes": {
            "https://ga.jspm.io/npm:react@18.0.0-rc.0/": {
                "object-assign": "https://ga.jspm.io/npm:object-assign@4.1.1/index.js"
            }
        }
    }
    const configuration: Configuration = ({
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
                        "container": "root"
                    }
                ]
            }
        },
        "common": {
            "importMap": importMapContent
        }
    })

    it("generate full configuration", () => {
        document.head.appendChild = vi.fn()
        importMap(configuration)

        const expectedTag = `<script type="importmap">${JSON.stringify(importMapContent)}</script>`
        expect(document.head.appendChild.mock.calls[0][0].toString()).toBe(expectedTag)
    })
})
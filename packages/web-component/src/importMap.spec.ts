import {Configuration, ImportMap} from '@orchy-mfe/models'
import {describe, it, expect, vi} from 'vitest'

vi.stubGlobal('URL', {createObjectURL: () => undefined})
vi.mock('es-module-shims', () => ({}))

import importMap from './importMap'

describe('importMap', () => {
    window.importShim = {addImportMap: vi.fn()}

    const importMapContent = {
        'imports': {
            'react': 'https://ga.jspm.io/npm:react@18.0.0-rc.0/index.js'
        },
        'scopes': {
            'https://ga.jspm.io/npm:react@18.0.0-rc.0/': {
                'object-assign': 'https://ga.jspm.io/npm:object-assign@4.1.1/index.js'
            }
        }
    }

    const configurationBuilder: (importMap?: ImportMap) => Configuration = (importMap?: ImportMap) => ({
        'microPages': {
            '/route/load': {
                'pageConfiguration': 'page-config',
                'microFrontends': [
                    {
                        'entryPoint': '//localhost:3001',
                        'id': 'microfrontend-test-1',
                        'properties': {
                            'mfName': 'Name test'
                        },
                        'container': 'root'
                    }
                ]
            }
        },
        'common': {
            'importMap': importMap
        }
    })

    it('correctly import defined maps', () => {
        const result = importMap(configurationBuilder(importMapContent))

        expect(importShim.addImportMap).toHaveBeenCalledOnce()
        expect(importShim.addImportMap).toHaveBeenCalledWith(importMapContent)

        expect(Object.keys(result).length).toEqual(1)
        expect(result.postProcessTemplate).toBeDefined()
    })

    it('correctly skip not defined maps', () => {
        const result = importMap(configurationBuilder())

        expect(importShim.addImportMap).not.toHaveBeenCalled()

        expect(result).toMatchObject({})
    })
})
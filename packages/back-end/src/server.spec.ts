import {describe, expect, it} from 'vitest'

import {buildServer} from './server'

describe('Server', () => {
  it('Rejects for missing CONFIG_PATH env variable', async () => {
    await expect(buildServer()).rejects.toBeDefined()
  })

  it('Resolves server creation', async () => {
    process.env.CONFIG_PATH = './'
    const server = await buildServer()

    await server.close()
  })
})


import tap from 'tap'
import {buildServer} from './server.js'

tap.test('Server', (t) => {
  t.plan(2)
  t.test('Reject for missing CONFIG_PATH env variable', async (t) => {
    t.plan(1)
    t.rejects(buildServer)
  })

  t.test('Resolve server creation', async (t) => {
    process.env.CONFIG_PATH = './'
    const server = await buildServer()

    t.teardown(async () => {
      await server.close()
    })
  })
})

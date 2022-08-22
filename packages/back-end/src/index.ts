import {buildServer} from './server.js'

const server = await buildServer()

await server.listen({ host: '0.0.0.0', port: server.config.SERVER_PORT })

export default server
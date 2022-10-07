import {buildServer} from './server.js'

const server = await buildServer()

await server.listen({host: '::', port: server.config.SERVER_PORT})

export default server
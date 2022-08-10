import fp from "fastify-plugin"
import { FastifyPluginAsync } from "fastify"
import { Static, Type } from "@sinclair/typebox"
import Ajv from "ajv"
import {ValidateFunction} from 'ajv/lib/types'

const ConfigSchema = Type.Strict(
  Type.Object({
    LOG_LEVEL: Type.String({default: 'silent'}),
    SERVER_PORT: Type.Number({default: 3000}),
    CONFIG_PATH: Type.String()
  })
)

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
  allowUnionTypes: true,
})

export type Config = Static<typeof ConfigSchema>;

const assertValidEnv = (valid: boolean, validate: ValidateFunction) => {
  if (!valid) {
    throw new Error(`Env variables validation failed - ${JSON.stringify(validate.errors, null, 2)}`)
  }
}

const configPlugin: FastifyPluginAsync = async (server) => {
  const validate = ajv.compile(ConfigSchema)
  const valid = validate(process.env)

  assertValidEnv(valid, validate)
  
  server.decorate("config", process.env)
}

declare module "fastify" {
  interface FastifyInstance {
    config: Config;
  }
}

export default fp(configPlugin)

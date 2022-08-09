import { MicroFrontend } from './microfrontend/Microfrontend'

export type Configuration = {
  microFrontends: MicroFrontend[],
  importMap?: Record<string, string>
}

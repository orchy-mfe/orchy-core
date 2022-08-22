import { Common } from './Common'
import { MicroFrontend } from './Microfrontend'

export type Configuration = {
  microFrontends: Record<string, MicroFrontend>,
  common?: Common
}

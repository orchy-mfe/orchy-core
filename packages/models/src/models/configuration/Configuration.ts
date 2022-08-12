import { Common } from './Common'
import { MicroFrontend } from './Microfrontend'

export type Configuration = {
  microFrontends: MicroFrontend[],
  common?: Common
}

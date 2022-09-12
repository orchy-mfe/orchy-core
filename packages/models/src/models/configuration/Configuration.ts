import {Common} from './Common'
import {MicroPage} from './MicroPage'

export type Configuration = {
  microPages: Record<string, MicroPage>,
  common?: Common
}

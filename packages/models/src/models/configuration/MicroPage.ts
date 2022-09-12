type Properties = Record<string, unknown>

export type MicroFrontend = {
  container?: string,
  entryPoint: string,
  id: string,
  properties?: Properties,
}

export type MicroPage = {
  pageConfiguration?: string,
  microFrontends: MicroFrontend[],
  properties?: Properties,
}
type Properties = Record<string, unknown>

export type Application = {
  container?: string,
  entryPoint: string,
  id: string,
  properties?: Properties,
}

export type MicroFrontend = {
  pageConfiguration?: string,
  applications: Application[],
  properties?: Properties,
}
export type MicroFrontend = {
  entryPoints: string[],
  id: string,
  route: string,
  pageConfiguration?: string,
  properties?: Record<any, unknown>,
}

export type ImportMap = {
    imports: Record<string, string>,
    scopes?: Record<string, Record<string, string>>
}

export type Common = {
    stylesheets?: string[],
    importMap?: ImportMap
}
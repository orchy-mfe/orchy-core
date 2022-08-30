import { Configuration } from '@orchy/models'
import { FrameworkConfiguration } from 'qiankun'
import './importMapConfiguration'
import 'es-module-shims'

type PostProcessTemplate = NonNullable<FrameworkConfiguration['postProcessTemplate']>

type SingleScript = ReturnType<PostProcessTemplate>['scripts'][0]

const scriptMapper: (script: SingleScript) => SingleScript = (script: SingleScript) => {
    const isString = typeof script === 'string'
    return isString ? script.replace('import(', 'importShim(') : script
}

const postProcessTemplate: PostProcessTemplate = (tplResult) => {
    tplResult.scripts = tplResult.scripts.map(scriptMapper)
    return tplResult
}

const installImportMaps = (configurationContent: Configuration): Partial<FrameworkConfiguration> => {
    if (configurationContent.common?.importMap) {
        importShim.addImportMap(configurationContent.common.importMap)

        return {
            postProcessTemplate
        }
    }
    return {}
}

export default installImportMaps
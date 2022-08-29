import { Configuration } from '@orchy/models'
import { FrameworkConfiguration } from 'qiankun'
import 'es-module-shims'

type PostProcessTemplate = NonNullable<FrameworkConfiguration["postProcessTemplate"]>

type SingleScript = ReturnType<PostProcessTemplate>["scripts"][0]

const scriptMapper: (script: SingleScript) => SingleScript = (script: SingleScript) => {
    if (typeof script === 'string') {
        script = script.replace('import(', 'importShim(')
    }
    return script
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
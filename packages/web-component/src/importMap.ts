import {Configuration} from '@orchy/models'
import { FrameworkConfiguration } from 'qiankun'
import 'es-module-shims'

const postProcessTemplate: FrameworkConfiguration["postProcessTemplate"] = (tplResult) => {
    tplResult.scripts = tplResult.scripts.map(script => {
        if(typeof script === 'string') {
            script = script.replace('import(', 'importShim(')
        }
        return script
    })
    return tplResult
}

const installImportMaps = (configurationContent: Configuration): Partial<FrameworkConfiguration> => {
    if(configurationContent.common?.importMap) {
        importShim.addImportMap(configurationContent.common.importMap)

        return {
            postProcessTemplate
        }
    }
    return {}
}

export default installImportMaps
import {Configuration} from '@orchy-mfe/models'
import './importMapConfiguration'
import 'es-module-shims'

const installImportMaps = (configurationContent: Configuration): void => {
    if (configurationContent.common?.importMap) {
        importShim.addImportMap(configurationContent.common.importMap)
    }
}

export default installImportMaps
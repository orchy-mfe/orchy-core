import './importMapConfiguration'
import 'es-module-shims'

import {Configuration} from '@orchy-mfe/models'

const installImportMaps = (configurationContent: Configuration): void => {
    if (configurationContent.common?.importMap) {
        importShim.addImportMap(configurationContent.common.importMap)
    }
}

export default installImportMaps
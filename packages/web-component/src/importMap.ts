import {Configuration, ElementPageConfiguration} from '@orchy/models'
import { ImportMap } from '@orchy/models'
import { pageBuilder } from '@orchy/page-builder'

const generateImportMapConfig = (importMap: ImportMap): ElementPageConfiguration => ({
    type: "element",
    tag: "script",
    attributes: {
        type: 'importmap'
    },
    properties: {
        innerHTML: JSON.stringify(importMap)
    }
})

const installImportMaps = (configurationContent: Configuration) => {
    if(configurationContent.common?.importMap) {
        const pageConfig = generateImportMapConfig(configurationContent.common.importMap)
        pageBuilder([pageConfig], document.head)
    }
}

export default installImportMaps
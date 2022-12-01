export const shimImporter = (createdNode: DocumentFragment) => {
    if(window.importShim) {
        const importShim = window.importShim

        createdNode.querySelectorAll('script[type="module"]').forEach(script => {
            importShim((script as HTMLScriptElement).src)
            script.remove()
        })
    }
}
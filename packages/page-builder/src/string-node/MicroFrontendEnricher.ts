import {MicroFrontendProperties} from '@orchy-mfe/models'

const propertiesSetter = (microFrontendProperties: MicroFrontendProperties) => (element: Element) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {'orchy-micro-frontend': _, ...attributes} = element.getAttributeNames().reduce((acc, name: string) => {
        acc[name] = element.getAttribute(name)
        return acc
    }, {} as Record<string, string | null>)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    element.orchyProperties = {...microFrontendProperties, ...attributes}
}

export const enrichMicroFrontendNode = (createdNode: DocumentFragment, microFrontendProperties: MicroFrontendProperties) => {
    const setProperties = propertiesSetter(microFrontendProperties)

    createdNode.querySelectorAll('[orchy-micro-frontend]').forEach(setProperties)
    if(createdNode.firstElementChild?.hasAttribute('orchy-micro-frontend')) {
        setProperties(createdNode.firstElementChild)
    }
}
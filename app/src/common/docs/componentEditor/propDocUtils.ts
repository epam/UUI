import {
    IComponentDocs,
    IPropSamplesCreationContext,
    PropDoc,
    PropDocPropsUnknown,
    PropExampleObject,
} from '@epam/uui-docs';

interface IPropWithContextParam<TProps = PropDocPropsUnknown> {
    prop: PropDoc<TProps, keyof TProps>
    ctx: IPropSamplesCreationContext<TProps>
}
type TPropInputData = { value?: unknown | undefined, exampleId?: string | undefined };
export type TPropInputDataAll = { [name in keyof PropDocPropsUnknown]?: TPropInputData };

export function buildExamplesList<TProps = PropDocPropsUnknown>(params: IPropWithContextParam<TProps>): PropExampleObject<TProps[keyof TProps]>[] {
    const { prop, ctx } = params;
    const examples = prop.examples;
    let res: unknown[] = [];
    if (typeof examples === 'function') {
        res = examples(ctx);
    } else if (examples.length) {
        res = examples;
    }
    return res as PropExampleObject<TProps[keyof TProps]>[];
}

export function buildPropInputDataInitial(params: IPropWithContextParam): TPropInputData {
    const data: TPropInputData = { value: undefined };
    const defaultExample = getDefaultPropExample(params);
    if (defaultExample) {
        data.exampleId = defaultExample.id;
        data.value = defaultExample.value;
    }
    return data;
}

export function buildPropInputDataAll(params: { docs: IComponentDocs<PropDocPropsUnknown>, ctx: IPropSamplesCreationContext }): TPropInputDataAll {
    const { docs, ctx } = params;
    const inputData: TPropInputDataAll = {};
    docs.props.forEach((prop) => {
        inputData[prop.name] = buildPropInputDataInitial({ prop, ctx });
    });
    return inputData;
}

function getDefaultPropExample(params: IPropWithContextParam): PropExampleObject<unknown> {
    const { prop } = params;
    const propExamples = buildExamplesList(params);
    let exampleResolved = propExamples.find((i) => i.isDefault);
    if (!exampleResolved && prop.isRequired) {
        exampleResolved = propExamples[0];
    }
    return exampleResolved;
}

export function buildExamplesAndFindByValue(params: IPropWithContextParam & { value: unknown }) {
    const { prop, ctx, value } = params;
    return buildExamplesList({ prop, ctx }).find((ex) => ex.value === value);
}

export function buildExamplesAndFindById(params: IPropWithContextParam & { id: unknown }) {
    const { prop, ctx, id } = params;
    return buildExamplesList({ prop, ctx }).find((ex) => ex.id === id);
}

export function updatePropInputData(
    params: {
        prop: PropDoc<PropDocPropsUnknown, keyof PropDocPropsUnknown>,
        prevInputData: TPropInputDataAll,
        newPropData: TPropInputData
    },
): TPropInputDataAll {
    const { prevInputData, prop, newPropData } = params;
    const newPropDataNorm = { ...prevInputData[prop.name] };
    if (newPropData.exampleId === undefined) {
        delete newPropDataNorm.exampleId;
    } else {
        newPropDataNorm.exampleId = newPropData.exampleId;
    }
    if (newPropData.value === undefined) {
        delete newPropDataNorm.value;
    } else {
        newPropDataNorm.value = newPropData.value;
    }
    return {
        ...prevInputData,
        [prop.name]: newPropDataNorm,
    };
}

export function isPropValueEmpty(propValue: unknown): boolean {
    return propValue === undefined;
}

export function rebuildInputDataExamples(
    params: {
        prevInputData: TPropInputDataAll,
        docs: IComponentDocs<PropDocPropsUnknown>,
        ctx: IPropSamplesCreationContext
    },
): TPropInputDataAll {
    const { prevInputData, docs, ctx } = params;
    return Object.keys(prevInputData).reduce<TPropInputDataAll>((acc, propName) => {
        const prev = prevInputData[propName];
        if (prev.exampleId !== undefined) {
            const prop = docs.props.find((p) => p.name === propName);
            const example = buildExamplesAndFindById({ prop, ctx, id: prev.exampleId });
            acc[propName] = {
                exampleId: example.id,
            };
            if (!isPropValueEmpty(example.value)) {
                acc[propName].value = example.value;
            }
        } else {
            acc[propName] = prev;
        }
        return acc;
    }, {});
}

/**
 * Removes all undefined values from the map.
 * @param inputData
 */
export function buildNormalizedInputValuesMap(inputData: TPropInputDataAll) {
    return Object.keys(inputData).reduce<PropDocPropsUnknown>((acc, name) => {
        const value = inputData[name].value;
        if (!isPropValueEmpty(value)) {
            acc[name] = value;
        }
        return acc;
    }, {});
}

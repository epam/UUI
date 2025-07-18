import { IPropSamplesCreationContext, PropDoc, PropExample } from '../../../types/types';

/**
 * It's applicable to union types only
 * Try to combine examples of duplicate props together, if possible
 * @param params
 */
export function mergeUnionTypeDuplicatePropsExamples(params: { prevProp: Omit<PropDoc<any, any>, 'name'>, nextProp: Omit<Partial<PropDoc<any, any>>, 'name'> }) {
    const { prevProp, nextProp } = params;
    if (typeof prevProp.examples !== 'function' && typeof nextProp.examples !== 'function') {
        return mergeExamplesArr(prevProp.examples, nextProp.examples);
    }
    return (ctx: IPropSamplesCreationContext<any>) => {
        const normalizeExamples = (p: Partial<PropDoc<any, any>>) => {
            return (typeof p.examples === 'function' ? p.examples(ctx) : p.examples) as PropExample<any>[];
        };
        const firstArr = normalizeExamples(prevProp);
        const secondArr = normalizeExamples(nextProp);
        return mergeExamplesArr(firstArr, secondArr);
    };
}

function mergeExamplesArr(firstArr: PropExample<any>[], secondArr: PropExample<any>[]) {
    const isEqual = (e1: PropExample<any>, e2: PropExample<any>) => {
        const getExampleValue = (e: PropExample<any>) => {
            return e.hasOwnProperty('value') ? e.value : e;
        };
        if (typeof e1.value === 'function' && typeof e2.value === 'function') {
            return e1.name === e2.name;
        }
        return getExampleValue(e1) === getExampleValue(e2);
    };
    const all: PropExample<any>[] = firstArr.concat(secondArr);
    return all.reduce((acc, item) => {
        const found = acc.find((inAcc: any) => isEqual(inAcc, item));
        if (!found) {
            acc.push(item);
        }
        return acc;
    }, []);
}

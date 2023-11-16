import {
    DocBuilder, IPropSamplesCreationContext, PropDoc,
    PropExample, TSkin, TDocConfig,
} from '@epam/uui-docs';
import { loadDocsGenType } from '../../apiReference/dataHooks';
import { docCommonOverride } from './docOverrides/globalOverride';
import { buildPropDetails, buildPropFallbackDetails } from './propDetailsBuilders/build';
import { TTypeProp } from '../../apiReference/sharedTypes';

/**
 * Generates DocBuilder using given type metadata & any optional overrides
 * @param params
 */
export async function docBuilderGen(params: { config: TDocConfig, skin: TSkin }): Promise<DocBuilder<any> | undefined> {
    const { config } = params;
    const {
        name,
        contexts,
        doc: skinCommonOverride,
        bySkin,
    } = config;
    const forSkin = bySkin[params.skin];
    if (forSkin) {
        const { doc: skinSpecificOverride, type: docGenType, component } = forSkin;
        const { content: type } = await loadDocsGenType(docGenType);

        const docs = new DocBuilder<any>({ name, component });
        const props = type.details?.props;
        const unresolvedProps: TTypeProp[] = [];
        props?.forEach((prop) => {
            let nextProp = buildPropDetails({ prop, docs, skin: params.skin });
            const isResolved = !!nextProp;
            if (!isResolved) {
                nextProp = buildPropFallbackDetails({ prop, docs, skin: params.skin });
                unresolvedProps.push(prop);
            }
            const prevProp = docs.getProp(prop.name);
            if (prevProp) {
                docs.merge(prop.name, {
                    examples: mergeUnionTypeDuplicatePropsExamples({ prevProp, nextProp }),
                });
            } else {
                docs.prop(prop.name, nextProp);
            }
        });
        docCommonOverride({ docs, contexts });
        skinCommonOverride?.(docs);
        skinSpecificOverride?.(docs);

        unresolvedProps.forEach((prop) => {
            const found = docs.props.find((p) => p.name === prop.name);
            const isPropNotComplete = Array.isArray(found.examples) && found.examples.length === 0 && !found.renderEditor;
            if (isPropNotComplete) {
                docs.merge(prop.name, { renderEditor: 'CantResolve' });
            }
        });

        return docs;
    }
}

/**
 * It's applicable to union types only
 * Try to combine examples of duplicate props together, if possible
 * @param params
 */
function mergeUnionTypeDuplicatePropsExamples(params: { prevProp: PropDoc<any, any>, nextProp: Partial<PropDoc<any, any>> }) {
    const { prevProp, nextProp } = params;

    return (ctx: IPropSamplesCreationContext<any>) => {
        const normalizeExamples = (p: Partial<PropDoc<any, any>>) => {
            return (typeof p.examples === 'function' ? p.examples(ctx) : p.examples) as PropExample<any>[];
        };
        const getExampleValue = (e: PropExample<any>) => {
            return e.hasOwnProperty('value') ? e.value : e;
        };
        const prevExamples = normalizeExamples(prevProp);
        const newExamples = normalizeExamples(nextProp);
        const all: PropExample<any>[] = prevExamples.concat(newExamples);
        const isEqual = (e1: PropExample<any>, e2: PropExample<any>) => {
            if (typeof e1.value === 'function' && typeof e2.value === 'function') {
                return e1.name === e2.name;
            }
            return getExampleValue(e1) === getExampleValue(e2);
        };
        return all.reduce((acc, item) => {
            const found = acc.find((inAcc: any) => isEqual(inAcc, item));
            if (!found) {
                acc.push(item);
            }
            return acc;
        }, []);
    };
}

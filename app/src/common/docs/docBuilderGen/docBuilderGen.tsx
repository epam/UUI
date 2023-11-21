import { DocBuilder, TSkin, TDocConfig } from '@epam/uui-docs';
import { loadDocsGenType } from '../../apiReference/dataHooks';
import { docCommonOverride } from './docOverrides/docCommonOverride';
import { buildPropDetails, buildPropFallbackDetails } from './propDetailsBuilders/build';
import { TTypeProp } from '../../apiReference/sharedTypes';
import { mergeUnionTypeDuplicatePropsExamples } from './propDetailsBuilders/shared/unionPropsUtil';

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
            const prevProp = docs.getPropDetails(prop.name);
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
            const isPropNotComplete = Array.isArray(found.examples) && found.examples.length === 0 && !found.editorType;
            if (isPropNotComplete) {
                docs.merge(prop.name, { editorType: 'CantResolve' });
            }
        });

        return docs;
    }
}

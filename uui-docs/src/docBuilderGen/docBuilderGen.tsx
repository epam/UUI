import { ThemeId, TSkin } from '../types';
import { DocBuilder, DocPreviewBuilder } from '../DocBuilder';
import { docCommonOverride } from './docOverrides/docCommonOverride';
import { buildPropDetails, buildPropFallbackDetails } from './propDetailsBuilders/build';
import { TOneOfItemType, TTypeProp, TTypeRef } from '../docsGen/sharedTypes';
import { mergeUnionTypeDuplicatePropsExamples } from './propDetailsBuilders/shared/unionPropsUtil';
import { IDocBuilderGenCtx, TDocConfig, TPropEditorTypeOverride } from './docBuilderGenTypes';

interface IDocBuilderGenParams {
    config: TDocConfig,
    skin: TSkin,
    theme: ThemeId,
    docBuilderGenCtx: IDocBuilderGenCtx,
}
/**
 * Generates DocBuilder using given type metadata & any optional overrides
 * @param params
 */
export async function docBuilderGen(params: IDocBuilderGenParams): Promise<DocBuilder<any> | undefined> {
    const { config, docBuilderGenCtx } = params;
    const { loadDocsGenType } = docBuilderGenCtx;
    const {
        name,
        contexts,
        doc: docCommon,
        preview: previewCommon,
        bySkin,
    } = config;
    const forSkin = bySkin[params.skin];
    if (forSkin) {
        const { doc: docSkin, type: docGenType, component, preview: previewSkin } = forSkin;
        const { content: type } = await loadDocsGenType(docGenType);

        const docs = new DocBuilder<any>({ name, component });
        const props = type.details?.props;
        const unresolvedProps: TTypeProp[] = [];
        props?.forEach((propParam) => {
            const prop = overrideProp(propParam, docBuilderGenCtx.propsOverride?.[propParam.name]);
            let nextProp = buildPropDetails({ prop, docs, skin: params.skin, docBuilderGenCtx });
            const isResolved = !!nextProp;
            if (!isResolved) {
                nextProp = buildPropFallbackDetails({ prop, docs, skin: params.skin, docBuilderGenCtx });
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

        const previewBuilder = new DocPreviewBuilder();
        docs.setDocPreview(previewBuilder);
        previewCommon?.(previewBuilder);
        previewSkin?.(previewBuilder);

        docCommonOverride({ docs, contexts });
        docCommon?.(docs, { theme: params.theme });
        docSkin?.(docs);

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

export function overrideProp(prop: TTypeProp, propOverride: TPropEditorTypeOverride[TTypeRef][string] | undefined): TTypeProp {
    if (propOverride) {
        if (prop.editor) {
            const t = prop.editor.type;
            const ot = propOverride.editor.type;
            if (prop.editor.type === ot) {
                let options = [];
                options.push(...propOverride.editor.options);
                options = sortOptions(options);

                const commentTags = propOverride.comment?.tags || {};
                return {
                    ...prop,
                    comment: {
                        ...prop.comment,
                        tags: {
                            ...prop.comment?.tags,
                            ...commentTags,
                        },
                    },
                    editor: {
                        ...prop.editor,
                        options,
                    },
                };
            } else {
                console.error(`Unable to override prop=${prop.name}. Reason: "editor.type" does not match (${t} !== ${ot})`);
            }
        } else {
            console.error(`Unable to override prop=${prop.name}. Reason: "editor" property is absent`);
        }
    }
    return prop;
}

// copied from uui-build/ts/tasks/docsGen/converters/converterUtils/propEditorUtils.ts
function sortOptions(options: TOneOfItemType[]): TOneOfItemType[] {
    const isNumeric = (opt: TOneOfItemType) => typeof opt === 'number';
    const isStrNumeric = (opt: TOneOfItemType) => typeof opt === 'string' && !isNaN(+opt);
    const isStrNumericOrNumeric = (opt: TOneOfItemType) => isNumeric(opt) || isStrNumeric(opt);
    //
    const sortedOptions = [...options];
    sortedOptions.sort((a: any, b: any) => {
        if (isNumeric(a) && isNumeric(b)) {
            return a - b; // Asc. E.g.: 1, 2, 3
        }
        if (isStrNumeric(a) && isStrNumeric(b)) {
            return +a - +b; // Asc. E.g.: '1', '2', '3'
        }
        if (isStrNumericOrNumeric(a) && isStrNumericOrNumeric(b)) {
            return (typeof a).localeCompare(typeof b); // Numbers go before strings. E.g: 1, 2, 3, '1', '2', '3'
        }
        return +isStrNumericOrNumeric(b) - +isStrNumericOrNumeric(a); // str and strNumeric go first, everything else go last
    });
    return sortedOptions;
}

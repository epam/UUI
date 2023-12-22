import { TOneOfItemType, TPropEditorType } from '../../docsGen/sharedTypes';
import { getColorDocBySkin } from '../../commonDocs';
import { TPropDocBuilder } from '../docBuilderGenTypes';
import { getComponentExamples, getTextExamplesNoUndefined } from './shared/reusableExamples';
import { IPropSamplesCreationContext } from '../../types';
import { COLOR_MAP } from '../../commonDocs';

const COLOR_PROP_NAMES = ['color'];
const SIMPLE_STRING_EDITOR_PROP_NAMES = ['key', 'id', 'settingsKey', 'htmlFor'];
const ICON_PROP_NAMES = [
    'icon',
    'upIcon',
    'downIcon',
    'infoIcon',
    'indeterminateIcon',
    'clearIcon',
    'dropdownIcon',
    'acceptIcon',
    'cancelIcon',
    'filledStarIcon',
    'emptyStarIcon',
];

const BY_EDITOR_TYPE: Record<TPropEditorType, TPropDocBuilder> = {
    [TPropEditorType.component]: (params) => {
        const { prop } = params;
        if (ICON_PROP_NAMES.indexOf(prop.name) !== -1) {
            return {
                editorType: 'IconEditor',
                examples: (ctx: IPropSamplesCreationContext) => {
                    return ctx.getIconList().map((value) => {
                        return {
                            id: value.id,
                            value,
                        };
                    });
                },
            };
        }
        return { examples: getComponentExamples() };
    },
    [TPropEditorType.number]: () => {
        return { editorType: 'NumEditor', examples: [] };
    },
    [TPropEditorType.func]: (params) => {
        const { prop } = params;
        return { examples: (ctx: any) => [ctx.getCallback(prop.name)] };
    },
    [TPropEditorType.bool]: () => {
        return { examples: [{ value: true }, { value: false }] };
    },
    [TPropEditorType.string]: (params) => {
        const { prop } = params;
        if (SIMPLE_STRING_EDITOR_PROP_NAMES.indexOf(prop.name) !== -1) {
            return { editorType: 'StringEditor', examples: [] };
        }
        return {
            examples: [
                { name: '', value: undefined },
                ...getTextExamplesNoUndefined(true),
            ],
            editorType: 'StringWithExamplesEditor',
        };
    },
    [TPropEditorType.oneOf]: (params) => {
        const { prop, skin } = params;
        const editor = prop.editor;
        if (editor.type === TPropEditorType.oneOf) {
            if (COLOR_PROP_NAMES.indexOf(prop.name) !== -1) {
                const { examples, ...rest } = getColorDocBySkin(skin).getPropDetails('color');
                return {
                    ...rest,
                    examples: (Object.keys(COLOR_MAP).filter((key) => {
                        return editor.options.indexOf(key) !== -1;
                    }) as TOneOfItemType[]).concat(editor.options.filter((example) => !COLOR_MAP[`${example}`])),
                };
            } else {
                return { examples: editor.options };
            }
        }
    },
};

/**
 * Resolve the prop editor based on the property's "editor.type" value.
 * See "public/docs/docsGenOutput/docsGenOutput.json" for details.
 */
export const buildByEditorType: TPropDocBuilder = (params) => {
    const { prop, docs, skin } = params;
    const peType = prop.editor?.type;
    if (peType) {
        const builder = BY_EDITOR_TYPE[peType];
        if (builder) {
            return builder({ prop, docs, skin });
        }
        throw new Error(`Unsupported prop editor type: ${peType}`);
    }
};

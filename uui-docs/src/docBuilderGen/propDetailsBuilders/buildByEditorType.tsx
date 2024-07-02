import { TOneOfItemType, TPropEditorType } from '../../docsGen/sharedTypes';
import { COLOR_MAP, getColorDocBySkin } from '../../commonDocs';
import { TPropDocBuilder } from '../docBuilderGenTypes';
import { getCallbackExample, getComponentExamples, getTextExamplesNoUndefined } from './shared/reusableExamples';

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
        const { prop, docBuilderGenCtx } = params;
        if (ICON_PROP_NAMES.indexOf(prop.name) !== -1) {
            return {
                editorType: 'IconEditor',
                examples: docBuilderGenCtx.getIconList().map((value) => {
                    return {
                        name: value.id,
                        value: value.icon,
                    };
                }),
            };
        }
        return { examples: getComponentExamples() };
    },
    [TPropEditorType.number]: () => {
        return { editorType: 'NumEditor', examples: [] };
    },
    [TPropEditorType.func]: (params) => {
        const { prop, docBuilderGenCtx } = params;
        return { examples: getCallbackExample({ uuiCtx: docBuilderGenCtx.uuiCtx, name: prop.name }) };
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
    [TPropEditorType.oneOfType]: (params) => {
        const { prop } = params;
        const editor = prop.editor;
        if (editor.type === TPropEditorType.oneOfType) {
            const isTypeSupported = (item: TPropEditorType) => ([TPropEditorType.string, TPropEditorType.number].indexOf(item) !== -1);
            if (editor.options.every(isTypeSupported)) {
                return { editorType: 'StringOrNumberEditor', examples: [] };
            }
        }
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
                const res = { examples: editor.options };
                switch (editor.scalarTypeOption) {
                    case TPropEditorType.string: {
                        return { ...res, editorType: 'StringWithExamplesEditor' };
                    }
                    case TPropEditorType.number: {
                        return { ...res, editorType: 'NumEditor' };
                    }
                    default: {
                        return res;
                    }
                }
            }
        }
    },
};

/**
 * Resolve the prop editor based on the property's "editor.type" value.
 * See "public/docs/docsGenOutput/docsGenOutput.json" for details.
 */
export const buildByEditorType: TPropDocBuilder = (params) => {
    const { prop, docs, skin, docBuilderGenCtx } = params;
    const peType = prop.editor?.type;
    if (peType) {
        const builder = BY_EDITOR_TYPE[peType];
        if (builder) {
            return builder({ prop, docs, skin, docBuilderGenCtx });
        }
        throw new Error(`Unsupported prop editor type: ${peType}`);
    }
};

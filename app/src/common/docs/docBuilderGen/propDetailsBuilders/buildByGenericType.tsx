import React from 'react';
import { PropDoc } from '@epam/uui-docs';
import { TPropEditorType } from '../../../apiReference/sharedTypes';
import { getDocBySkin } from './shared/reusableDocs';
import { TPropDocBuilder } from '../docBuilderGenTypes';

const COLOR_PROP_NAMES = ['color', 'appLogoBgColor', 'customerLogoBgColor'];
const STRING_EDITOR_PROP_NAMES = ['customerLogoUrl', 'customerLogoHref', 'logoHref', 'appLogoUrl', 'key', 'id', 'settingsKey'];
const ICON_PROP_NAMES = [
    'icon',
    'infoIcon',
    'indeterminateIcon',
    'clearIcon',
    'dropdownIcon',
    'acceptIcon',
    'cancelIcon',
    'filledStarIcon',
    'emptyStarIcon',
];

const boolDetailsBuilder: TPropDocBuilder = (params) => {
    const { prop } = params;
    const editor = prop.editor;
    if (editor.type === TPropEditorType.bool) {
        const res: Partial<PropDoc<any, any>> = { examples: [{ value: true }, { value: false }] };
        return res;
    }
    throw new Error('Unsupported type');
};

const componentDetailsBuilder: TPropDocBuilder = (params) => {
    const { prop, skin } = params;
    const editor = prop.editor;

    if (editor.type === TPropEditorType.component) {
        if (ICON_PROP_NAMES.indexOf(prop.name) !== -1) {
            const { name, ...rest } = getDocBySkin(skin, 'iconDoc').getProp('icon');
            return rest;
        }
        const SampleReactComponents = {
            SimpleComponent: () => (<div>ReactComponent</div>),
        };
        return { examples: [SampleReactComponents.SimpleComponent] };
    }
    throw new Error('Unsupported type');
};

const funcDetailsBuilder: TPropDocBuilder = (params) => {
    const { prop } = params;
    const editor = prop.editor;
    if (editor.type === TPropEditorType.func) {
        return { examples: (ctx: any) => [ctx.getCallback(prop.name)] };
    }
    throw new Error('Unsupported type');
};

const numberDetailsBuilder: TPropDocBuilder = (params) => {
    const { prop } = params;
    const editor = prop.editor;
    if (editor.type === TPropEditorType.number) {
        return {
            editorType: 'NumEditor',
            examples: [],
        };
    }
    throw new Error('Unsupported type');
};

const oneOfDetailsBuilder: TPropDocBuilder = (params) => {
    const { prop, skin } = params;
    const editor = prop.editor;
    if (editor.type === TPropEditorType.oneOf) {
        if (COLOR_PROP_NAMES.indexOf(prop.name) !== -1) {
            const { name, examples, ...rest } = getDocBySkin(skin, 'colorDoc').getProp('color');
            return {
                ...rest,
                examples: editor.options,
            };
        } else {
            return { examples: editor.options };
        }
    }
    throw new Error('Unsupported type');
};

const stringDetailsBuilder: TPropDocBuilder = (params) => {
    const { prop } = params;
    const editor = prop.editor;
    if (editor.type === TPropEditorType.string) {
        if (COLOR_PROP_NAMES.indexOf(prop.name) !== -1) {
            return {
                editorType: 'StringEditor',
                examples: [],
            };
        }
        if (STRING_EDITOR_PROP_NAMES.indexOf(prop.name) !== -1) {
            return {
                editorType: 'StringEditor',
                examples: [],
            };
        }
        return {
            examples: [
                { name: '', value: undefined },
                { name: 'short text', value: 'Hello, World!', isDefault: true },
                { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
                { name: 'Long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
            ],
            editorType: 'StringWithExamplesEditor',
        };
    }
    throw new Error('Unsupported type');
};

const genericTypesMap: Map<TPropEditorType, TPropDocBuilder> = new Map();
genericTypesMap.set(TPropEditorType.oneOf, oneOfDetailsBuilder);
genericTypesMap.set(TPropEditorType.string, stringDetailsBuilder);
genericTypesMap.set(TPropEditorType.bool, boolDetailsBuilder);
genericTypesMap.set(TPropEditorType.func, funcDetailsBuilder);
genericTypesMap.set(TPropEditorType.component, componentDetailsBuilder);
genericTypesMap.set(TPropEditorType.number, numberDetailsBuilder);

export const buildByGenericType: TPropDocBuilder = (params) => {
    const { prop, docs, skin } = params;
    const peType = prop.editor?.type;
    const builder = genericTypesMap.get(peType);
    if (builder) {
        return builder({ prop, docs, skin });
    }
};

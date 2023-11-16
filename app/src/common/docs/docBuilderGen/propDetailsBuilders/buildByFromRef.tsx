import React from 'react';
import { DocBuilder, iCanRedirectDoc, iEditable, iHasLabelDoc, TSkin } from '@epam/uui-docs';
import {
    IAnalyticableClick,
    ICanBeInvalid,
    IDropdownToggler,
    IHasCaption,
    IHasCX,
    IHasForwardedRef,
    IHasPlaceholder,
    IHasRawProps,
} from '@epam/uui-core';
import { TDocsGenExportedType } from '../../../apiReference/types';
import { TTypeRef } from '../../../apiReference/sharedTypes';
import { getCommonDoc } from './shared/reusableDocs';
import { TPropDocBuilder } from '../docBuilderGenTypes';

function getReactRefExamples(name: string) {
    return (ctx: any) => {
        return [
            {
                name: 'React.createRef<any>()',
                value: {
                    set current(p: any) {
                        const cb = ctx.getCallback(`${name}.current = `);
                        cb(p);
                    },
                },
            },
            ctx.getCallback(name),
        ];
    };
}

const COMMON_DOCS: Record<TTypeRef | TDocsGenExportedType, (skin?: TSkin) => DocBuilder<any>> = {
    '@epam/uui-core:IDropdownToggler': () => new DocBuilder<IDropdownToggler>({ name: '' }).prop('ref', {
        examples: getReactRefExamples('ref'),
    }),
    '@epam/uui-core:IHasForwardedRef': () => new DocBuilder<IHasForwardedRef<any>>({ name: '' }).prop('forwardedRef', {
        examples: getReactRefExamples('ref'),
    }),
    '@epam/uui-core:IHasLabel': () => iHasLabelDoc,
    '@epam/uui-core:IHasCX': () => new DocBuilder<IHasCX>({ name: '' }).prop('cx', {
        renderEditor: 'CssClassEditor',
        examples: [],
    }),
    '@epam/uui-core:IHasCaption': () => new DocBuilder<IHasCaption>({ name: '' })
        .prop('caption', {
            examples: [
                { value: undefined, name: '' },
                { value: 'Short text', isDefault: true },
                { name: 'Long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
                { name: 'Long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
            ],
            type: 'string',
        }),
    '@epam/uui-core:IHasPlaceholder': () => new DocBuilder<IHasPlaceholder>({ name: '' })
        .prop('placeholder', {
            examples: [
                { value: 'Short text' },
                { name: 'Long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
                { name: 'Long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
            ],
            type: 'string',
        }),
    '@epam/uui-core:IHasRawProps': () => {
        return new DocBuilder<IHasRawProps<any>>({ name: '' })
            .prop('rawProps', {
                renderEditor: 'JsonEditor',
                examples: [],
            });
    },
    '@epam/uui-core:ICanBeInvalid': () => new DocBuilder<ICanBeInvalid>({ name: 'isInvalid' })
        .prop('isInvalid', { examples: [true] })
        .prop('validationProps', {
            renderEditor: 'JsonEditor',
            examples: [],
        })
        .prop('validationMessage', {
            examples: [
                { name: 'String', value: 'This field is mandatory' },
                { name: 'ReactElement', value: (<b>This field is mandatory</b>) },
            ],
        }),
    '@epam/uui-core:IAnalyticableClick': () => new DocBuilder<IAnalyticableClick>({ name: '' })
        .prop('clickAnalyticsEvent', {
            examples: [
                { value: { name: 'test' }, name: '{ name: "test" }' },
            ],
        }),
    '@epam/uui-core:ICanRedirect': () => iCanRedirectDoc,
    '@epam/uui-core:PickerBaseOptions': () => getCommonDoc('pickerBaseOptionsDoc'),
    '@epam/uui-core:IEditable': () => {
        return new DocBuilder<any>({ name: '' }).implements([iEditable]);
    },
};

export const buildByFromRef: TPropDocBuilder = (params) => {
    const { prop, skin } = params;
    const db: DocBuilder<any> = COMMON_DOCS[prop.from]?.(skin);
    if (db) {
        const found = db.props.find((p) => p.name === prop.name);
        if (found) {
            const { name, ...details } = found;
            return details;
        }
    }
};

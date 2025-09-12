import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import {
    DocBuilder,
    getColorPickerComponent,
    TDocConfig,
    TDocContext,
    TSkin,
    COLOR_MAP,
    DocPreviewBuilder, TPreviewCellSize,
} from '@epam/uui-docs';
import { TTextPreview } from '@epam/uui-docs';

export const TextConfig: TDocConfig = {
    id: 'text',
    name: 'Text',
    contexts: [TDocContext.Default, TDocContext.Resizable, TDocContext.Form],
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:TextProps', component: uui.Text },
        [TSkin.Electric]: { type: '@epam/uui:TextProps', component: electric.Text },
        [TSkin.Loveship]: {
            type: '@epam/loveship:TextProps',
            component: loveship.Text,
        },
        [TSkin.Promo]: {
            type: '@epam/promo:TextProps',
            component: promo.Text,
        },
    },
    doc: (doc: DocBuilder<promo.TextProps | loveship.TextProps | uui.TextProps>) => {
        doc.merge('children', {
            examples: [
                { value: 'Hello World', isDefault: true }, {
                    value: 'At EPAM, we believe that technology defines business success, and we relentlessly pursue the best solution for every client to solve where others fail.',
                    name: 'long text',
                },
            ],
            editorType: 'StringWithExamplesEditor',
        });
        doc.merge('lineHeight', { editorType: 'NumEditor' });
        doc.merge('fontSize', { editorType: 'NumEditor' });
        doc.merge('color', {
            editorType: getColorPickerComponent({
                ...COLOR_MAP,
                primary: 'var(--uui-text-primary)',
                secondary: 'var(--uui-text-secondary)',
                tertiary: 'var(--uui-text-tertiary)',
                disabled: 'var(--uui-text-disabled)',
                white: 'var(--uui-neutral-0)',
                success: 'var(--uui-text-success)',
                info: 'var(--uui-text-info)',
                warning: 'var(--uui-text-warning)',
                critical: 'var(--uui-text-critical)',
                sky: 'var(--sky-70)',
                grass: 'var(--grass-70)',
                sun: 'var(--sun-70)',
                fire: 'var(--fire-70)',
                blue: 'var(--blue-70)',
                green: 'var(--green-70)',
                amber: 'var(--amber-70)',
                red: 'var(--red-70)',
            }),
        });
    },
    preview: (docPreview: DocPreviewBuilder<promo.TextProps | loveship.TextProps | uui.TextProps>) => {
        const TEST_DATA = {
            value1line: 'Abc',
            // eslint-disable-next-line
            value2lines: (<>{'Abc Abc Abc Abc'}</>),
            lineHeight: [12, 18, 24, 30],
            fontSize: [10, 12, 14, 16, 18, 24],
        };
        const w70_h85: TPreviewCellSize = '70-85';
        const w70_h55: TPreviewCellSize = '70-55';

        docPreview.add(TTextPreview['Size Variants'], [
            {
                size: { examples: '*' },
                children: { values: [TEST_DATA.value1line] },
            },
            {
                size: { examples: '*' },
                children: { values: [TEST_DATA.value2lines] },
                lineHeight: { values: TEST_DATA.lineHeight },
            },
            {
                size: { values: ['none'] },
                children: { values: [TEST_DATA.value1line] },
                fontSize: { values: TEST_DATA.fontSize },
                fontWeight: { examples: '*' },
                fontStyle: { examples: '*' },
            },
        ], w70_h85);
        docPreview.add(
            TTextPreview['Color Variants'],
            {
                children: { values: [TEST_DATA.value1line] },
                color: { examples: '*' },
            },
            w70_h55,
        );
    },
};

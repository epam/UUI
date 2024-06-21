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
import { EditableDocContent, DocExample, BaseDocsBlock } from '../common';
import { TTextPreview } from './_types/previewIds';

export class TextDoc extends BaseDocsBlock {
    title = 'Text';

    static override config: TDocConfig = {
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
            doc.merge('color', {
                editorType: getColorPickerComponent({
                    ...COLOR_MAP,
                    disabled: 'var(--uui-text-disabled)',
                    tertiary: 'var(--uui-text-tertiary)',
                }),
            });
        },
        preview: (docPreview: DocPreviewBuilder<promo.TextProps | loveship.TextProps | uui.TextProps>) => {
            const TEST_DATA = {
                value1line: 'Abc',
                // eslint-disable-next-line
                value2lines: (<>{'Abc Abc Abc Abc'}</>),
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
                    lineHeight: { examples: '*' },
                },
                {
                    size: { values: ['none'] },
                    children: { values: [TEST_DATA.value1line] },
                    fontSize: { examples: '*' },
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

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="text-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/text/Basic.example.tsx" />
            </>
        );
    }
}

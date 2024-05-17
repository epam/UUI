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
                value2lines: (<>{'Abc'}<br/>{'Abc'}</>),
            };
            const w70_h85: TPreviewCellSize = '70-85';
            const w60_h55: TPreviewCellSize = '60-55';
            const w70_h55: TPreviewCellSize = '70-55';
            const w60_h45: TPreviewCellSize = '60-45';

            docPreview.add(TTextPreview.Sizes, {
                size: { examples: '*' },
                children: { values: [TEST_DATA.value1line] },
            }, w60_h55);
            docPreview.add(TTextPreview['Font'], {
                children: { values: [TEST_DATA.value1line] },
                fontSize: { examples: '*' },
                fontWeight: { examples: '*' },
                fontStyle: { examples: '*' },
            }, w60_h45);
            docPreview.add(TTextPreview['Line Height'], {
                size: { examples: '*' },
                children: { values: [TEST_DATA.value2lines] },
                lineHeight: { examples: '*' },
            }, w70_h85);
            docPreview.add(
                TTextPreview.Colors,
                {
                    children: { values: [TEST_DATA.value1line] },
                    fontWeight: { values: ['900'] },
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

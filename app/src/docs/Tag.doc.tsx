import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import {
    COLOR_MAP,
    DocBuilder,
    DocPreviewBuilder,
    getColorPickerComponent,
    TDocConfig,
    TDocContext,
    TSkin,
} from '@epam/uui-docs';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../common';
import { getCurrentTheme } from '../helpers';
import { TTagPreview } from './_types/previewIds';

export class TagDoc extends BaseDocsBlock {
    title = 'Tag';

    static override config: TDocConfig = {
        name: 'Tag',
        contexts: [TDocContext.Default, TDocContext.Resizable, TDocContext.Form],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:TagProps', component: uui.Tag },
            [TSkin.Promo]: { type: '@epam/promo:TagProps', component: promo.Tag },
            [TSkin.Loveship]: { type: '@epam/loveship:TagProps', component: loveship.Tag },
            [TSkin.Electric]: { type: '@epam/electric:TagProps', component: electric.Tag },
        },
        doc: (doc: DocBuilder<loveship.TagProps | uui.TagProps | promo.TagProps | electric.TagProps>) => {
            doc.merge('iconPosition', { defaultValue: 'left' });
            doc.merge('color', {
                editorType: getColorPickerComponent({
                    ...COLOR_MAP,
                    neutral: `var(--uui-${getCurrentTheme() === 'loveship_dark' ? 'neutral-40' : 'neutral-30'})`,
                }),
            });
            doc.setDefaultPropExample('onClick', () => true);
            doc.merge('count', { examples: [{ value: '9' }, { value: '+99' }, { value: '+999' }] });
        },

        preview: (docPreview: DocPreviewBuilder<loveship.TagProps | uui.TagProps | promo.TagProps | electric.TagProps>) => {
            const TEST_DATA = {
                caption1Line: 'Test',
                // eslint-disable-next-line
                caption2Lines: (<>{'Test'}<br/>{'Test'}</>),
                icon: 'action-account-fill.svg',
            };
            docPreview.add({
                id: TTagPreview['One-line caption'],
                matrix: {
                    caption: { values: [TEST_DATA.caption1Line] },
                    size: { examples: '*' },
                    count: { values: [undefined, '+999'] },
                    icon: { examples: [TEST_DATA.icon, undefined] },
                    iconPosition: { examples: '*', condition: (pp) => !!pp.icon },
                    isDropdown: { examples: '*' },
                    onClear: { examples: ['callback', undefined] },
                },
                cellSize: '180-60',
            });
            docPreview.add({
                id: TTagPreview['Two-line caption'],
                matrix: {
                    caption: { values: [TEST_DATA.caption2Lines] },
                    size: { examples: '*' },
                    count: { values: [undefined, '+999'] },
                    isDropdown: { examples: '*' },
                    onClear: { examples: ['callback', undefined] },
                    icon: { examples: [TEST_DATA.icon, undefined] },
                    iconPosition: { examples: '*' },
                },
                cellSize: '180-80',
            });
            docPreview.add({
                id: TTagPreview['No caption'],
                matrix: {
                    caption: { values: [undefined] },
                    size: { examples: '*' },
                    count: { values: [undefined, '+999'] },
                    icon: { examples: [TEST_DATA.icon, undefined] },
                    isDropdown: { examples: '*', condition: (pp, v) => !v ? !!pp.icon : true },
                    onClear: { examples: ['callback', undefined] },
                },
                cellSize: '150-60',
            });
            docPreview.add({
                id: TTagPreview.Colors,
                matrix: {
                    caption: { values: [TEST_DATA.caption1Line] },
                    icon: { examples: [TEST_DATA.icon] },
                    count: { values: ['+999'] },
                    isDropdown: { values: [true] },
                    color: { examples: '*' },
                    fill: { examples: '*' },
                    isDisabled: { examples: '*' },
                },
                cellSize: '130-60',
            });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="tag-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/tag/Basic.example.tsx" />
                <DocExample title="Size" path="./_examples/tag/Size.example.tsx" />
                <DocExample title="Color variants" path="./_examples/tag/Colors.example.tsx" />
            </>
        );
    }
}

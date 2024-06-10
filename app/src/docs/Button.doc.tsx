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
    TDocContext, TPreviewMatrix,
    TSkin,
} from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';
import { getCurrentTheme } from '../helpers';
import { TButtonPreview } from './_types/previewIds';

export class ButtonDoc extends BaseDocsBlock {
    title = 'Button';

    static override config: TDocConfig = {
        name: 'Button',
        contexts: [TDocContext.Default, TDocContext.Resizable, TDocContext.Form],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:ButtonProps', component: uui.Button },
            [TSkin.Loveship]: {
                type: '@epam/loveship:ButtonProps',
                component: loveship.Button,
                preview: (docPreview: DocPreviewBuilder<loveship.ButtonProps>) => {
                    docPreview.update(TButtonPreview['One-line caption'], (prev) => ({ shape: { examples: '*' }, ...prev }));
                    docPreview.update(TButtonPreview['Two-line caption'], (prev) => ({ shape: { examples: '*' }, ...prev }));
                    docPreview.update(TButtonPreview['No caption'], (prev) => ({ shape: { examples: '*' }, ...prev }));
                },
            },
            [TSkin.Promo]: { type: '@epam/promo:ButtonProps', component: promo.Button },
            [TSkin.Electric]: { type: '@epam/uui:ButtonProps', component: electric.Button },
        },
        doc: (doc: DocBuilder<uui.ButtonProps | promo.ButtonProps | loveship.ButtonProps>) => {
            doc.merge('iconPosition', { defaultValue: 'left' });
            doc.merge('color', {
                editorType: getColorPickerComponent({
                    ...COLOR_MAP,
                    gray50: `var(--uui-${getCurrentTheme() === 'loveship_dark' ? 'neutral-40' : 'neutral-60'})`,
                    gray: `var(--uui-${getCurrentTheme() === 'loveship_dark' ? 'neutral-50' : 'neutral-60'})`,
                    neutral: `var(--uui-${getCurrentTheme() === 'loveship_dark' ? 'neutral-50' : 'neutral-60'})`,
                }),
            });
            doc.setDefaultPropExample('onClick', () => true);
        },
        preview: (docPreview: DocPreviewBuilder<uui.ButtonProps | promo.ButtonProps | loveship.ButtonProps>) => {
            const TEST_DATA = {
                caption1Line: 'Test',
                // eslint-disable-next-line
                caption2Lines: (<>{'Test'}<br/>{'Test'}</>),
                icon: 'action-account-fill.svg',
            };
            type TMatrixLocal = TPreviewMatrix<uui.ButtonProps | promo.ButtonProps | loveship.ButtonProps>;
            docPreview.add({
                id: TButtonPreview['One-line caption'],
                matrix: {
                    caption: { values: [TEST_DATA.caption1Line] },
                    size: { examples: '*' },
                    icon: { examples: [TEST_DATA.icon, undefined] },
                    iconPosition: { examples: '*', condition: (pp) => !!pp.icon },
                    isDropdown: { examples: '*' },
                    onClear: { examples: ['callback', undefined] },
                },
                cellSize: '150-60',
            });
            docPreview.add({
                id: TButtonPreview['Two-line caption'],
                matrix: {
                    caption: { values: [TEST_DATA.caption2Lines] },
                    size: { examples: '*' },
                    isDropdown: { examples: '*' },
                    onClear: { examples: ['callback', undefined] },
                    icon: { examples: [TEST_DATA.icon, undefined] },
                    iconPosition: { examples: '*' },
                },
                cellSize: '150-90',
            });
            docPreview.add({
                id: TButtonPreview['No caption'],
                matrix: {
                    caption: { values: [undefined] },
                    size: { examples: '*' },
                    icon: { examples: [TEST_DATA.icon, undefined] },
                    isDropdown: { examples: '*', condition: (pp, v) => !v ? !!pp.icon : true },
                    onClear: { examples: ['callback', undefined] },
                },
                cellSize: '110-70',
            });
            const colorVariantsMatrix: TMatrixLocal = {
                caption: { values: [TEST_DATA.caption1Line] },
                icon: { examples: [TEST_DATA.icon] },
                isDropdown: { values: [true] },
                color: { examples: '*' },
                fill: { examples: '*' },
                isDisabled: { examples: '*' },
            };
            docPreview.add(TButtonPreview['Color Variants'], colorVariantsMatrix, '100-50');
            docPreview.add(TButtonPreview['Pseudo State Hover'], colorVariantsMatrix, '100-50');
            docPreview.add(TButtonPreview['Pseudo State Active'], colorVariantsMatrix, '100-50');
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="button-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/button/Basic.example.tsx" />
                <DocExample title="Size" path="./_examples/button/Size.example.tsx" />
                <DocExample title="Styles" path="./_examples/button/Styling.example.tsx" />
                <DocExample title="Button with Icon" path="./_examples/button/Icon.example.tsx" />
                <DocExample title="Button with link" path="./_examples/button/Link.example.tsx" />
                <DocExample title="Button as a Toggler" path="./_examples/button/Toggler.example.tsx" />
            </>
        );
    }
}

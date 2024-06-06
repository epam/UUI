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
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';
import { getCurrentTheme } from '../helpers';
import { TIconButtonPreview } from './_types/previewIds';
import { ReactComponent as ActionIcon } from '@epam/assets/icons/action-account-fill.svg';

export class IconButtonDoc extends BaseDocsBlock {
    title = 'Icon Button';

    static override config: TDocConfig = {
        name: 'IconButton',
        contexts: [TDocContext.Default, TDocContext.Form],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:IconButtonProps', component: uui.IconButton },
            [TSkin.Electric]: { type: '@epam/uui:IconButtonProps', component: electric.IconButton },
            [TSkin.Loveship]: { type: '@epam/loveship:IconButtonProps', component: loveship.IconButton },
            [TSkin.Promo]: { type: '@epam/promo:IconButtonProps', component: promo.IconButton },
        },
        doc: (doc: DocBuilder<promo.IconButtonProps | loveship.IconButtonProps| uui.IconButtonProps>) => {
            doc.merge('color', {
                editorType: getColorPickerComponent({
                    ...COLOR_MAP,
                    neutral: `var(--uui-${getCurrentTheme() === 'loveship_dark' ? 'neutral-10' : 'neutral-60'})`,
                }),
            });
            doc.setDefaultPropExample('onClick', () => true);
            doc.setDefaultPropExample('icon', ({ value }) => value === ActionIcon);
        },
        preview: (docPreview: DocPreviewBuilder<promo.IconButtonProps | loveship.IconButtonProps| uui.IconButtonProps>) => {
            const TEST_DATA = {
                icon: 'action-account-fill.svg',
                dropdownIcon: 'navigation-chevron_down-outline.svg',
            };
            docPreview.add({
                id: TIconButtonPreview['Color Variants'],
                matrix: {
                    size: { values: ['24'] },
                    color: { examples: '*' },
                    dropdownIcon: { examples: [TEST_DATA.dropdownIcon] },
                    showDropdownIcon: { values: [true] },
                    isOpen: { values: [false] },
                    icon: { examples: [TEST_DATA.icon] },
                    isDisabled: { values: [false] },
                    href: { values: ['https://www.epam.com'] },
                },
                cellSize: '60-40',
            });
            docPreview.add({
                id: TIconButtonPreview['Size Variants'],
                matrix: {
                    dropdownIcon: { examples: [undefined, TEST_DATA.dropdownIcon] },
                    showDropdownIcon: { values: [true], condition: (props) => !!props.dropdownIcon },
                    isOpen: { values: [false, true], condition: (props) => !!props.dropdownIcon },
                    isDisabled: { values: [false, true] },
                    icon: { examples: [undefined, TEST_DATA.icon], condition: (props, v) => (v === undefined ? !!props.dropdownIcon : true) },
                    size: { examples: '*' },
                    color: { examples: ['info'] },
                    href: { values: ['https://www.epam.com'] },
                },
                cellSize: '80-50',
            });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="icon-button-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/iconButton/Basic.example.tsx" />
            </>
        );
    }
}

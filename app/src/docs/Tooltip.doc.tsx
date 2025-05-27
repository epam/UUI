import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { offset } from '@floating-ui/react';
import { COLOR_MAP, DocBuilder, DocPreviewBuilder, getColorPickerComponent, TDocConfig, TSkin } from '@epam/uui-docs';
import { getCurrentTheme } from '../helpers';
import { TTooltipPreview } from './_types/previewIds';
import { ReactComponent as ActionAccountFillIcon } from '@epam/assets/icons/action-account-fill.svg';
import { DocItem } from '../documents/structure';

export const tooltipExplorerConfig: TDocConfig = {
    name: 'Tooltip',
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:TooltipProps', component: uui.Tooltip },
        [TSkin.Electric]: { type: '@epam/uui:TooltipProps', component: electric.Tooltip },
        [TSkin.Loveship]: { type: '@epam/loveship:TooltipProps', component: loveship.Tooltip },
        [TSkin.Promo]: { type: '@epam/promo:TooltipProps', component: promo.Tooltip },
    },
    doc: (doc: DocBuilder<uui.TooltipProps | loveship.TooltipProps | promo.TooltipProps>) => {
        doc.merge('closeDelay', { examples: [0, 500, 1000] });
        doc.merge('openDelay', { examples: [0, 500, 1000] });
        doc.merge('children', {
            examples: [{ value: <uui.Button fill="solid" size="36" caption="Button" />, name: 'Solid button', isDefault: true }],
        });
        doc.merge('renderContent', {
            examples: [
                { name: '() => <i>ReactNode example</i>', value: () => <i>ReactNode example</i> },
                { name: "() => 'Text example'", value: () => 'Text example' },
            ],
        });
        doc.merge('content', {
            examples: [{ value: 'Some text', isDefault: true }, { value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa', name: 'long text' }],
            editorType: 'StringWithExamplesEditor',
        });
        doc.merge('offset', {
            description: 'Translates the floating element along the specified axes. Previous most used signature ["skidding", "distance"] deprecated and will be removed in future versions. Use { crossAxis: 50, mainAxis: 50 } instead.',
            examples: [
                { name: '{ crossAxis: 50, mainAxis: 50 }', value: { crossAxis: 50, mainAxis: 50 } },
                { name: '{ crossAxis: 50, mainAxis: 0 }', value: { crossAxis: 50, mainAxis: 0 } },
                { name: '{ crossAxis: 0, mainAxis: 50 }', value: { crossAxis: 0, mainAxis: 50 } },
                { name: '() => ({ crossAxis: 100, mainAxis: 100 })', value: () => ({ crossAxis: 100, mainAxis: 100 }) },
                { name: '[50, 50]', value: [50, 50] },
            ],
        });
        doc.merge('middleware', { examples: [{ name: '[offset(25)]', value: [offset(25)] }] });
        doc.merge('color', {
            editorType: getColorPickerComponent({
                ...COLOR_MAP,
                night900: `var(--uui-${getCurrentTheme() === 'loveship_dark' ? 'neutral-50' : 'neutral-80'})`,
                neutral: `var(--uui-${getCurrentTheme() === 'loveship_dark' ? 'neutral-70' : 'neutral-0'})`,
                inverted: `var(--uui-${getCurrentTheme() === 'loveship_dark' ? 'neutral-10' : 'neutral-80'})`,
            }),
        });
    },
    preview: (docPreview: DocPreviewBuilder<uui.TooltipProps | loveship.TooltipProps | promo.TooltipProps>) => {
        const TEST_DATA = {
            content: 'Test',
            children: (
                <uui.IconContainer icon={ ActionAccountFillIcon } />
            ),
        };
        docPreview.add({
            id: TTooltipPreview['Color Variants'],
            matrix: {
                closeOnMouseLeave: { values: [false] },
                value: { values: [true] },
                placement: { values: ['bottom-start'] },
                children: { values: [TEST_DATA.children] },
                content: { values: [TEST_DATA.content] },
                color: { examples: '*' },
            },
            cellSize: '65-90',
        });
    },
};

export const TooltipDocItem: DocItem = {
    id: 'tooltip',
    name: 'Tooltip',
    parentId: 'components',
    examples: [
        { descriptionPath: 'tooltip-descriptions' },
        { name: 'Types', componentPath: './_examples/tooltip/Types.example.tsx' },
        { name: 'Variants (Styles)', componentPath: './_examples/tooltip/Variants.example.tsx' },
        { name: 'Tooltip placement', componentPath: './_examples/tooltip/Placement.example.tsx' },
        { name: 'Custom markup', componentPath: './_examples/tooltip/CustomMarkup.example.tsx' },
        { name: 'Tooltip with delay', componentPath: './_examples/tooltip/Delay.example.tsx' },
        { name: 'Tooltip with icon', componentPath: './_examples/tooltip/WithIcon.example.tsx' },
        { name: 'Tooltip with a link', componentPath: './_examples/tooltip/WithLink.example.tsx' },
    ],
    explorerConfig: tooltipExplorerConfig,
};

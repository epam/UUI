import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { offset } from '@floating-ui/react';
import { COLOR_MAP, DocBuilder, DocPreviewBuilder, getColorPickerComponent, TDocConfig, TSkin } from '@epam/uui-docs';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../common';
import { getCurrentTheme } from '../helpers';
import { TTooltipPreview } from './_types/previewIds';
import { ReactComponent as ActionAccountFillIcon } from '@epam/assets/icons/action-account-fill.svg';

export class TooltipDoc extends BaseDocsBlock {
    title = 'Tooltip';

    static override config: TDocConfig = {
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
                description: 'Translates the floating element along the specified axes. https://floating-ui.com/docs/offset',
                examples: [
                    { name: '{ crossAxis: 50, mainAxis: 50 }', value: { crossAxis: 50, mainAxis: 50 } },
                    { name: '{ crossAxis: 50, mainAxis: 0 }', value: { crossAxis: 50, mainAxis: 0 } },
                    { name: '{ crossAxis: 0, mainAxis: 50 }', value: { crossAxis: 0, mainAxis: 50 } },
                    { name: '() => ({ crossAxis: 100, mainAxis: 100 })', value: () => ({ crossAxis: 100, mainAxis: 100 }) },
                ],
            });
            doc.merge('middleware', { examples: [{ name: '[offset(6)]', value: [offset(6)] }] });
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

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="tooltip-descriptions" />
                {this.renderSectionTitle('Overview')}
                <DocExample title="Types" path="./_examples/tooltip/Types.example.tsx" />

                <DocExample title="Variants (Styles)" path="./_examples/tooltip/Variants.example.tsx" />

                <DocExample title="Tooltip placement" path="./_examples/tooltip/Placement.example.tsx" />

                <DocExample title="Custom markup" path="./_examples/tooltip/CustomMarkup.example.tsx" />

                {this.renderSectionTitle('Examples')}
                <DocExample title="Tooltip with delay" path="./_examples/tooltip/Delay.example.tsx" />
                <DocExample title="Tooltip with icon" path="./_examples/tooltip/WithIcon.example.tsx" />
                <DocExample title="Tooltip with a link" path="./_examples/tooltip/WithLink.example.tsx" />
            </>
        );
    }
}

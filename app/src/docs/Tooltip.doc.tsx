import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, TSkin,
} from '../common';
import { TDocConfig } from '../common/docs/docBuilderGen/types';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { DocBuilder } from '@epam/uui-docs';

export class TooltipDoc extends BaseDocsBlock {
    title = 'Tooltip';

    override config: TDocConfig = {
        name: 'Tooltip',
        bySkin: {
            [TSkin.UUI]: {
                type: '@epam/uui:TooltipProps',
                component: uui.Tooltip,
                doc: (doc: DocBuilder<uui.TooltipProps>) => {
                    doc.merge('children', {
                        examples: [{ value: <uui.Button fill="solid" size="36" caption="Button" />, name: 'Solid button', isDefault: true }],
                    });
                    doc.merge('color', { renderEditor: 'MultiUnknownEditor' });
                },
            },
            [TSkin.UUI3_loveship]: {
                type: '@epam/loveship:TooltipProps',
                component: loveship.Tooltip,
                doc: (doc: DocBuilder<loveship.TooltipProps>) => {
                    doc.merge('children', {
                        examples: [{ value: <loveship.Button fill="solid" size="36" caption="Button" />, name: 'Solid button', isDefault: true }],
                    });
                },
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/promo:TooltipProps',
                component: promo.Tooltip,
                doc: (doc: DocBuilder<promo.TooltipProps>) => {
                    doc.merge('children', {
                        examples: [{ value: <promo.Button fill="solid" size="36" caption="Button" />, name: 'Solid button', isDefault: true }],
                    });
                },
            },
        },
        doc: (doc: DocBuilder<uui.TooltipProps | loveship.TooltipProps | promo.TooltipProps>) => {
            doc.merge('value', { isRequired: false });
            doc.merge('content', {
                examples: [{ value: 'Some text', isDefault: true }, { value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa', name: 'long text' }],
                type: 'string',
            });
            doc.merge('offset', {
                examples: [
                    { name: '[50, 50]', value: [50, 50] },
                    { name: '[50, 0]', value: [50, 0] },
                    { name: '[0, 50]', value: [0, 50] },
                    { name: '() => ([100, 100])', value: () => ([100, 100]) },
                ],
            });
            doc.merge('modifiers', { examples: [{ name: "[{ name: 'offset', options: { offset: [0, 6] } }]", value: [{ name: 'offset', options: { offset: [0, 6] } }] }] });
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

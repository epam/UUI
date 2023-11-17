import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class BadgeDoc extends BaseDocsBlock {
    title = 'Badge';

    override config: TDocConfig = {
        name: 'Badge',
        contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Resizable],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:BadgeProps', component: uui.Badge },
            [TSkin.UUI3_loveship]: { type: '@epam/loveship:BadgeProps', component: loveship.Badge },
            [TSkin.UUI4_promo]: { type: '@epam/promo:BadgeProps', component: promo.Badge },
        },
        doc: (doc: DocBuilder<uui.BadgeProps | promo.BadgeProps | loveship.BadgeProps>) => {
            doc.merge('countIndicator', {
                examples: [{ name: '<CountIndicator />', value: null }],
                editorType: 'SingleUnknownEditor',
            });
            doc.merge('count', {
                examples: [0,
                    1,
                    123,
                    { name: '"This is a string"', value: 'This is a string' },
                    { name: '<i>This is React.ReactElement</i>', value: <i>This is React.ReactElement</i> }],
            });
            doc.merge('iconPosition', { defaultValue: 'left' });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="badge-descriptions" />
                {this.renderSectionTitle('Overview')}
                <DocExample title="Types" path="./_examples/badge/Types.example.tsx" />
                <DocExample title="Color variants" path="./_examples/badge/Colors.example.tsx" />
                <DocExample title="Styles" path="./_examples/badge/Styles.example.tsx" />
                <DocExample title="Sizes" path="./_examples/badge/Size.example.tsx" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Attributes" path="./_examples/badge/Attributes.example.tsx" />
                <DocExample title="Dropdown" path="./_examples/badge/Dropdown.example.tsx" />
                <DocExample title="Badge width status indicator" path="./_examples/badge/StatusIndicator.example.tsx" />
            </>
        );
    }
}

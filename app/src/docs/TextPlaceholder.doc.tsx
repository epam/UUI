import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../common';

export class TextPlaceholderDoc extends BaseDocsBlock {
    title = 'TextPlaceholder';

    override config: TDocConfig = {
        name: 'TextPlaceholder',
        contexts: [TDocContext.Default, TDocContext.Resizable, TDocContext.Form],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:TextPlaceholderProps', component: uui.TextPlaceholder },
            [TSkin.UUI3_loveship]: { type: '@epam/uui:TextPlaceholderProps', component: loveship.TextPlaceholder },
            [TSkin.UUI4_promo]: { type: '@epam/uui:TextPlaceholderProps', component: promo.TextPlaceholder },
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="textPlaceholder-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/textPlaceholder/Basic.example.tsx" />
            </>
        );
    }
}

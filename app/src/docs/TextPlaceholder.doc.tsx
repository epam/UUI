import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../common';

export class TextPlaceholderDoc extends BaseDocsBlock {
    title = 'TextPlaceholder';

    static override config: TDocConfig = {
        name: 'TextPlaceholder',
        contexts: [TDocContext.Default, TDocContext.Resizable, TDocContext.Form],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:TextPlaceholderProps', component: uui.TextPlaceholder },
            [TSkin.Electric]: { type: '@epam/uui:TextPlaceholderProps', component: electric.TextPlaceholder },
            [TSkin.Loveship]: { type: '@epam/uui:TextPlaceholderProps', component: loveship.TextPlaceholder },
            [TSkin.Promo]: { type: '@epam/uui:TextPlaceholderProps', component: promo.TextPlaceholder },
        },
        doc: (doc: DocBuilder<uui.TextPlaceholderProps>) => {
            doc.merge('wordsCount', { examples: [2, 3, 4, 5, 6, 12, 150] });
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

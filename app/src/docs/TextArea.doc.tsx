import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../common';

export class TextAreaDoc extends BaseDocsBlock {
    title = 'TextArea';

    override config: TDocConfig = {
        name: 'TextArea',
        contexts: [TDocContext.Default, TDocContext.Resizable, TDocContext.Form],
        bySkin: {
            [TSkin.UUI3_loveship]: { type: '@epam/uui:TextAreaProps', component: loveship.TextArea },
            [TSkin.UUI4_promo]: { type: '@epam/uui:TextAreaProps', component: promo.TextArea },
            [TSkin.UUI]: { type: '@epam/uui:TextAreaProps', component: uui.TextArea },
        },
        doc: (doc: DocBuilder<uui.TextAreaProps>) => {
            doc.merge('mode', { defaultValue: 'form' });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="textArea-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/textArea/Basic.example.tsx" />
                <DocExample title="Height configuration" path="./_examples/textArea/HeightConfiguration.example.tsx" />
                <DocExample title="With length limit" path="./_examples/textArea/MaxLengthCounter.example.tsx" />
            </>
        );
    }
}

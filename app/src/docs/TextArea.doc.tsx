import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../common';

export class TextAreaDoc extends BaseDocsBlock {
    title = 'TextArea';

    static override config: TDocConfig = {
        name: 'TextArea',
        contexts: [TDocContext.Default, TDocContext.Resizable, TDocContext.Form],
        bySkin: {
            [TSkin.Loveship]: { type: '@epam/uui:TextAreaProps', component: loveship.TextArea },
            [TSkin.Promo]: { type: '@epam/uui:TextAreaProps', component: promo.TextArea },
            [TSkin.UUI]: { type: '@epam/uui:TextAreaProps', component: uui.TextArea },
            [TSkin.Electric]: { type: '@epam/uui:TextAreaProps', component: electric.TextArea },
        },
        doc: (doc: DocBuilder<uui.TextAreaProps>) => {
            doc.merge('mode', { defaultValue: 'form' });
            doc.merge('rows', { examples: [1, 10, 20, 30] });
            doc.merge('maxLength', { examples: [5, 30, 50, 120] });
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

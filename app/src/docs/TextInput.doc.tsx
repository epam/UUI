import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4 } from '../common';

export class TextInputDoc extends BaseDocsBlock {
    title = 'Text Input';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/inputs/docs/textInput.doc.ts',
            [UUI4]: './epam-promo/components/inputs/docs/textInput.doc.ts',
        };
    }


    renderContent() {
        return (
            <>
                <EditableDocContent fileName='textInput-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/textInput/Basic.example.tsx'
                />
                <DocExample
                    title='Size'
                    path='./examples/textInput/Size.example.tsx'
                />
                <DocExample
                    title='Action'
                    path='./examples/textInput/Action.example.tsx'
                />
            </>
        );
    }
}
import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI4, UUI3 } from '../common';

export class ButtonDoc extends BaseDocsBlock {
    title = 'Button';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/buttons/docs/button.doc.ts',
            [UUI4]: './epam-promo/components/buttons/docs/button.doc.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='button-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/button/Basic.example.tsx'
                />
                <DocExample
                    title='Size'
                    path='./examples/button/Size.example.tsx'
                />
                <DocExample
                    title='Styles'
                    path='./examples/button/Styling.example.tsx'
                />
                <DocExample
                    title='Button with Icon'
                    path='./examples/button/Icon.example.tsx'
                />
                <DocExample
                    title='Button with link'
                    path='./examples/button/Link.example.tsx'
                />
                <DocExample
                    title='Button as a Toggler'
                    path='./examples/button/Toggler.example.tsx'
                />
            </>
        );
    }
}
import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI4, UUI3 } from '../common';

export class LinkButtonDoc extends BaseDocsBlock {
    title = 'Link Button';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docProps/loveship/components/buttons/linkButton.doc.tsx',
            [UUI4]: './epam-promo/components/buttons/docs/linkButton.doc.ts',
        };
    }


    renderContent() {
        return (
            <>
                <EditableDocContent fileName='link-button-descriptions' />
                { this.renderSectionTitle('Overview') }
                <DocExample
                    title='Link Button'
                    path='./examples/linkButton/Default.example.tsx'
                />

                <DocExample
                    title='Sizes'
                    path='./examples/linkButton/Size.example.tsx'
                />

                <DocExample
                    title='Icon Positions'
                    path='./examples/linkButton/IconPosition.example.tsx'
                />

                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Secondary action in small footer'
                    path='./examples/common/Card.example.tsx'
                />

                <DocExample
                    title='Sorting'
                    path='./examples/linkButton/Sorting.example.tsx'
                />
            </>
        );
    }
}

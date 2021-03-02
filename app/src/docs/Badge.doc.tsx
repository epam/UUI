import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI4, UUI3 } from '../common';

export class BadgeDoc extends BaseDocsBlock {
    title = 'Badge';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/widgets/docs/badge.doc.ts',
            [UUI4]: './epam-promo/components/widgets/docs/badge.doc.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='badge-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/badge/Basic.example.tsx'
                />
                <DocExample
                    title='Size'
                    path='./examples/badge/Size.example.tsx'
                />
                <DocExample
                    title='Colors'
                    path='./examples/badge/Colors.example.tsx'
                />
                <DocExample
                    title='Advanced'
                    path='./examples/badge/Advanced.example.tsx'
                />
            </>
        );
    }
}
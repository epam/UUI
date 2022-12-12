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
                { this.renderSectionTitle('Overview') }
                <DocExample
                    title='Types'
                    path='./examples/badge/Types.example.tsx'
                />
                <DocExample
                    title='Color variants'
                    path='./examples/badge/Colors.example.tsx'
                />
                <DocExample
                    title='Styles'
                    path='./examples/badge/Styles.example.tsx'
                />
                <DocExample
                    title='Sizes'
                    path='./examples/badge/Size.example.tsx'
                />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Attributes'
                    path='./examples/badge/Attributes.example.tsx'
                />
                <DocExample
                    title='Indicator mode'
                    path='./examples/badge/Indicator.example.tsx'
                />
            </>
        );
    }
}
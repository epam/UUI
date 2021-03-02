import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4 } from '../common';

export class SpinnerDoc extends BaseDocsBlock {
    title = 'Spinner';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/widgets/docs/spinner.doc.ts',
            [UUI4]: './epam-promo/components/widgets/docs/spinner.doc.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='spinner-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/spinner/Basic.example.tsx'
                />
            </>
        );
    }
}
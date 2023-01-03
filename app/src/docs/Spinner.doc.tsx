import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4 } from '../common';

export class SpinnerDoc extends BaseDocsBlock {
    title = 'Spinner';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docProps/loveship/components/widgets/spinner.doc.ts',
            [UUI4]: './app/src/docProps/epam-promo/components/widgets/spinner.doc.tsx',
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

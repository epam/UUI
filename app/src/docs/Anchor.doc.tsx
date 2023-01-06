import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI4 } from '../common';

export class AnchorDoc extends BaseDocsBlock {
    title = 'Anchor';

    getPropsDocPath() {
        return {
            [UUI4]: './app/src/docs/_props/epam-promo/components/navigation/anchor.props.tsx',
        };
    }


    renderContent() {
        return (
            <>
                <EditableDocContent fileName='anchor-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./_examples/anchor/Basic.example.tsx'
                />
            </>
        );
    }
}

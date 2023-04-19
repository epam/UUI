import React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4, UUI } from '../common';

export class TabButtonDoc extends BaseDocsBlock {
    title = 'Tab Button';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/buttons/tabButton.props.ts',
            [UUI4]: './app/src/docs/_props/epam-promo/components/buttons/tabButton.props.ts',
            [UUI]: './app/src/docs/_props/uui/components/buttons/tabButton.props.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='tab-button-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./_examples/tabButton/Basic.example.tsx'
                />
            </>
        );
    }
}

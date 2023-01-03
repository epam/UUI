import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4 } from '../common';

export class MainMenuDoc extends BaseDocsBlock {
    title = 'Main Menu';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docProps/loveship/components/navigation/mainMenu.doc.tsx',
            [UUI4]: './app/src/docProps/epam-promo/components/navigation/mainMenu.doc.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='mainMenu-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/mainMenu/Basic.example.tsx'
                    width='auto'
                />

                <DocExample
                    title='Responsive'
                    path='./examples/mainMenu/Responsive.example.tsx'
                    width='auto'
                />
            </>
        );
    }
}

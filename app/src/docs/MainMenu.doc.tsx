import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../common';

export class MainMenuDoc extends BaseDocsBlock {
    title = 'Main Menu';

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

                <DocExample
                    title='Main Menu Custom elements'
                    path='./examples/mainMenu/CustomElements.example.tsx'
                    width='auto'
                />
            </>
        );
    }
}
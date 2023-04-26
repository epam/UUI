import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4,
} from '../common';

export class MainMenuDoc extends BaseDocsBlock {
    title = 'Main Menu';
    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/navigation/mainMenu.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/navigation/mainMenu.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="mainMenu-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/mainMenu/Basic.example.tsx" width="auto" />

                <DocExample title="Responsive" path="./_examples/mainMenu/Responsive.example.tsx" width="auto" />
            </>
        );
    }
}

import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4, UUI, TDocsGenType,
} from '../common';

import css from './styles.module.scss';

export class MainMenuDoc extends BaseDocsBlock {
    title = 'Main Menu';

    override getDocsGenType = (): TDocsGenType => ('@epam/uui:MainMenuProps');

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/navigation/mainMenu.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/navigation/mainMenu.props.tsx',
            [UUI]: './app/src/docs/_props/uui/components/navigation/mainMenu.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="mainMenu-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample cx={ css.appBg } title="Basic" path="./_examples/mainMenu/Basic.example.tsx" width="auto" />

                <DocExample cx={ css.appBg } title="Responsive" path="./_examples/mainMenu/Responsive.example.tsx" width="auto" />
            </>
        );
    }
}

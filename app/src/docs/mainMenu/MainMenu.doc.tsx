import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, DocPreviewBuilder, TDocConfig, TDocContext, TPreviewCellSize, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../common';
import { childrenExamples, itemsExamples, renderBurgerExamples } from './mainMenuExamples';
//
import css from './../styles.module.scss';
import { TMainMenuPreview } from '../_types/previewIds';

export class MainMenuDoc extends BaseDocsBlock {
    title = 'Main Menu';

    static override config: TDocConfig = {
        name: 'MainMenu',
        contexts: [TDocContext.Resizable],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:MainMenuProps', component: uui.MainMenu },
            [TSkin.Electric]: { type: '@epam/uui:MainMenuProps', component: electric.MainMenu },
            [TSkin.Loveship]: { type: '@epam/uui:MainMenuProps', component: loveship.MainMenu },
            [TSkin.Promo]: { type: '@epam/uui:MainMenuProps', component: promo.MainMenu },
        },
        doc: (doc: DocBuilder<uui.MainMenuProps>) => {
            doc.merge('children', { examples: childrenExamples, remountOnChange: true });
            doc.merge('customerLogoBgColor', { editorType: 'StringEditor', examples: [] });
            doc.merge('customerLogoUrl', { editorType: 'StringEditor', examples: [] });
            doc.merge('customerLogoHref', { editorType: 'StringEditor', examples: [] });
            doc.merge('logoHref', { editorType: 'StringEditor', examples: [] });
            doc.merge('appLogoUrl', { editorType: 'StringEditor', examples: [] });
            doc.merge('renderBurger', { examples: renderBurgerExamples });
            doc.merge('items', { examples: itemsExamples, remountOnChange: true });
            doc.merge('MainMenuDropdown', { examples: [{ value: uui.MainMenuDropdown, name: 'MainMenuDropdown', isDefault: true }] });
            doc.merge('Burger', { examples: [{ value: uui.Burger, name: 'Burger', isDefault: true }] });
            doc.merge('logoLink', {
                editorType: 'LinkEditor',
                examples: [{ name: '{pathname: "/"}', value: { pathname: '/' } }],
            });
            doc.merge('customerLogoLink', {
                editorType: 'LinkEditor',
                examples: [{ name: '{pathname: "/"}', value: { pathname: '/' } }],
            });
        },
        preview: (docPreview: DocPreviewBuilder<uui.MainMenuProps>) => {
            const w600_h80: TPreviewCellSize = '600-80';
            docPreview.add({
                id: TMainMenuPreview['Common Variants'],
                matrix: {
                    items: { examples: ['Learn'] },
                },
                cellSize: w600_h80,
            });
        },
    };

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

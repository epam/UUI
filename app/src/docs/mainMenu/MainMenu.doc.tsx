import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import {
    DocBuilder,
    DocPreviewBuilder,
    IPropSamplesCreationContext,
    TDocConfig,
    TDocContext,
    TPreviewCellSize,
    TSkin,
} from '@epam/uui-docs';
import { getChilrdenExamples, getItemsExamples, renderBurgerExamples } from './mainMenuExamples';
import css from './../styles.module.scss';
import { TMainMenuPreview } from '../_types/previewIds';
import { DocItem } from '../../documents/structure';

export const mainMenuExplorerConfig: TDocConfig = {
    name: 'MainMenu',
    contexts: [TDocContext.Resizable],
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:MainMenuProps', component: uui.MainMenu },
        [TSkin.Electric]: {
            type: '@epam/electric:MainMenuProps',
            component: electric.MainMenu,
            doc: (doc) => {
                doc.merge('color', { editorType: 'MultiUnknownEditor', remountOnChange: true, defaultValue: 'dark' });
            },
        },
        [TSkin.Loveship]: {
            type: '@epam/loveship:MainMenuProps',
            component: loveship.MainMenu,
            doc: (doc) => {
                doc.merge('color', { editorType: 'MultiUnknownEditor', remountOnChange: true, defaultValue: 'dark' });
            },
        },
        [TSkin.Promo]: { type: '@epam/uui:MainMenuProps', component: promo.MainMenu },
    },
    doc: (doc: DocBuilder<uui.MainMenuProps | loveship.MainMenuProps | electric.MainMenuProps>) => {
        doc.merge('children', { examples: (ctx) => getChilrdenExamples(ctx), remountOnChange: true });
        doc.merge('customerLogoBgColor', { editorType: 'StringEditor', examples: [] });
        doc.merge('customerLogoUrl', { editorType: 'StringEditor', examples: [] });
        doc.merge('customerLogoHref', { editorType: 'StringEditor', examples: [] });
        doc.merge('logoHref', { editorType: 'StringEditor', examples: [] });
        doc.merge('appLogoUrl', { editorType: 'StringEditor', examples: [] });
        doc.merge('renderBurger', { examples: renderBurgerExamples });
        doc.merge('items', { examples: (ctx) => getItemsExamples(ctx), remountOnChange: true });
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
        const fakeCtx = {
            getSelectedProps: () => ({}),
        } as IPropSamplesCreationContext<any>;
        const TEST_DATA = {
            items: getItemsExamples(fakeCtx)[1].value,
        };

        docPreview.add({
            id: TMainMenuPreview['All Variants'],
            matrix: {
                items: { values: [TEST_DATA.items] },
            },
            cellSize: w600_h80,
        });
    },
};

export const MainMenuDocItem: DocItem = {
    id: 'mainMenu',
    name: 'Main Menu',
    parentId: 'components',
    examples: [
        { descriptionPath: 'mainMenu-descriptions' },
        { name: 'Basic', componentPath: './_examples/mainMenu/Basic.example.tsx' },
        { name: 'Responsive', componentPath: './_examples/mainMenu/Responsive.example.tsx' },
        { name: 'Light menu (Electric)', componentPath: './_examples/mainMenu/LightElectric.example.tsx', themes: ['electric'], cx: css.appBg },
        { name: 'Light menu (Loveship)', componentPath: './_examples/mainMenu/LightLoveship.example.tsx', themes: ['loveship'], cx: css.appBg },
    ],
    explorerConfig: mainMenuExplorerConfig,
    tags: ['MainMenu'],
};

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
import { getItemsExamples } from './mainMenuExamples';
import { TMainMenuPreview } from '@epam/uui-docs';

export const MainMenuConfig: TDocConfig = {
    id: 'mainMenu',
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
        doc.merge('items', { examples: (ctx) => getItemsExamples(ctx), remountOnChange: true });
    },
    preview: (docPreview: DocPreviewBuilder<uui.MainMenuProps>) => {
        const w600_h80: TPreviewCellSize = '600-80';
        const fakeCtx = {
            getSelectedProps: () => ({}),
        } as IPropSamplesCreationContext<any>;
        const TEST_DATA = {
            items: getItemsExamples(fakeCtx)[0].value,
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

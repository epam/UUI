import * as React from 'react';
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
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../common';
import { QueryHelpers } from '../../common/docs/baseDocBlock/utils/queryHelpers';
import { getItemsExamples } from './mainMenuExamples';
import { TMainMenuPreview } from '../_types/previewIds';

import css from './../styles.module.scss';

export class MainMenuDoc extends BaseDocsBlock {
    title = 'Main Menu';

    static override config: TDocConfig = {
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

    renderContent() {
        const theme = QueryHelpers.getTheme();
        const isElectric = theme === TSkin.Electric;
        const isLoveship = theme === TSkin.Loveship;
        return (
            <>
                <EditableDocContent fileName="mainMenu-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample cx={ css.appBg } title="Basic" path="./_examples/mainMenu/Basic.example.tsx" width="auto" />

                <DocExample cx={ css.appBg } title="Responsive" path="./_examples/mainMenu/Responsive.example.tsx" width="auto" />
                { isElectric && (<DocExample title="Light menu" path="./_examples/mainMenu/LightElectric.example.tsx" width="auto" cx={ css.appBg } />) }
                { isLoveship && (<DocExample title="Light menu" path="./_examples/mainMenu/LightLoveship.example.tsx" width="auto" cx={ css.appBg } />) }
            </>
        );
    }
}

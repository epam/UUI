import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { TDocConfig, TDocContext, TSkin } from '../';
import { DocItem } from './_types/docItem';

export const blockerExplorerConfig: TDocConfig = {
    name: 'Blocker',
    contexts: [TDocContext.RelativePanel],
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui-components:BlockerProps', component: uui.Blocker },
        [TSkin.Loveship]: { type: '@epam/uui-components:BlockerProps', component: loveship.Blocker },
        [TSkin.Promo]: { type: '@epam/uui-components:BlockerProps', component: promo.Blocker },
        [TSkin.Electric]: { type: '@epam/uui-components:BlockerProps', component: electric.Blocker },
    },
};

export const BlockerDocItem: DocItem = {
    id: 'blocker',
    name: 'Blocker',
    parentId: 'components',
    examples: [
        { descriptionPath: 'blocker-descriptions' },
        { name: 'Basic', componentPath: './_examples/blocker/Basic.example.tsx' },
        { name: 'Advanced', componentPath: './_examples/blocker/Advanced.example.tsx' },
    ],
    explorerConfig: blockerExplorerConfig,
};

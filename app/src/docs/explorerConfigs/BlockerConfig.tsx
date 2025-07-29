import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';

export const BlockerConfig: TDocConfig = {
    id: 'blocker',
    name: 'Blocker',
    contexts: [TDocContext.RelativePanel],
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui-components:BlockerProps', component: uui.Blocker },
        [TSkin.Loveship]: { type: '@epam/uui-components:BlockerProps', component: loveship.Blocker },
        [TSkin.Promo]: { type: '@epam/uui-components:BlockerProps', component: promo.Blocker },
        [TSkin.Electric]: { type: '@epam/uui-components:BlockerProps', component: electric.Blocker },
    },
};

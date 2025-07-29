import * as uui from '@epam/uui';
import { TDocConfig, TSkin } from '@epam/uui-docs';

export const TreeConfig: TDocConfig = {
    id: 'tree',
    name: 'Tree',
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:TreeProps', component: uui.Tree },
        [TSkin.Promo]: { type: '@epam/uui:TreeProps', component: uui.Tree },
        [TSkin.Electric]: { type: '@epam/uui:TreeProps', component: uui.Tree },
        [TSkin.Loveship]: { type: '@epam/uui:TreeProps', component: uui.Tree },
    },
};

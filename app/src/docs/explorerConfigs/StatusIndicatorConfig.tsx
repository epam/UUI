import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';

export const StatusIndicatorConfig: TDocConfig = {
    id: 'statusIndicator',
    name: 'StatusIndicator',
    contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Resizable],
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:StatusIndicatorProps', component: uui.StatusIndicator },
        [TSkin.Loveship]: { type: '@epam/loveship:StatusIndicatorProps', component: loveship.StatusIndicator },
        [TSkin.Promo]: { type: '@epam/promo:StatusIndicatorProps', component: promo.StatusIndicator },
        [TSkin.Electric]: { type: '@epam/electric:StatusIndicatorProps', component: electric.StatusIndicator },
    },
};

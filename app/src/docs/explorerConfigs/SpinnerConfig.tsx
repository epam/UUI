import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';

export const SpinnerConfig: TDocConfig = {
    id: 'spinner',
    name: 'Spinner',
    contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Resizable],
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:SpinnerProps', component: uui.Spinner },
        [TSkin.Electric]: { type: '@epam/uui:SpinnerProps', component: electric.Spinner },
        [TSkin.Loveship]: { type: '@epam/uui:SpinnerProps', component: loveship.Spinner },
        [TSkin.Promo]: { type: '@epam/uui:SpinnerProps', component: promo.Spinner },
    },
};

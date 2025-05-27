import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { DocItem } from '../documents/structure';

export const spinnerExplorerConfig: TDocConfig = {
    name: 'Spinner',
    contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Resizable],
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:SpinnerProps', component: uui.Spinner },
        [TSkin.Electric]: { type: '@epam/uui:SpinnerProps', component: electric.Spinner },
        [TSkin.Loveship]: { type: '@epam/uui:SpinnerProps', component: loveship.Spinner },
        [TSkin.Promo]: { type: '@epam/uui:SpinnerProps', component: promo.Spinner },
    },
};

export const SpinnerDocItem: DocItem = {
    id: 'spinner',
    name: 'Spinner',
    parentId: 'components',
    examples: [
        { descriptionPath: 'spinner-descriptions' },
        { name: 'Basic', componentPath: './_examples/spinner/Basic.example.tsx' },
    ],
    explorerConfig: spinnerExplorerConfig,
};

import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { TDocConfig, TDocContext, TSkin } from '../';
import { DocItem } from './_types/docItem';

export const statusIndicatorExplorerConfig: TDocConfig = {
    name: 'StatusIndicator',
    contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Resizable],
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:StatusIndicatorProps', component: uui.StatusIndicator },
        [TSkin.Loveship]: { type: '@epam/loveship:StatusIndicatorProps', component: loveship.StatusIndicator },
        [TSkin.Promo]: { type: '@epam/promo:StatusIndicatorProps', component: promo.StatusIndicator },
        [TSkin.Electric]: { type: '@epam/electric:StatusIndicatorProps', component: electric.StatusIndicator },
    },
};

export const StatusIndicatorDocItem: DocItem = {
    id: 'statusIndicator',
    name: 'Status Indicator',
    parentId: 'components',
    examples: [
        { descriptionPath: 'statusIndicator-descriptions' },
        { name: 'Sizes example', componentPath: './_examples/statusIndicator/Sizes.example.tsx' },
        { name: 'Fill & Colors example', componentPath: './_examples/statusIndicator/Basic.example.tsx' },
        { name: 'Uses in Table example', componentPath: './_examples/statusIndicator/WithTable.example.tsx' },
        { name: 'Dropdown example', componentPath: './_examples/statusIndicator/Dropdown.example.tsx' },
    ],
    explorerConfig: statusIndicatorExplorerConfig,
};

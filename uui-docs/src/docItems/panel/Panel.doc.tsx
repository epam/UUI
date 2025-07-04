import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '../../';
import { childrenExamples } from './panelExamples';
import { DocItem } from '../_types/docItem';

export const panelExplorerConfig: TDocConfig = {
    name: 'Panel',
    contexts: [TDocContext.Resizable, TDocContext.Default],
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:PanelProps', component: uui.Panel },
        [TSkin.Loveship]: { type: '@epam/loveship:PanelProps', component: loveship.Panel },
        [TSkin.Promo]: { type: '@epam/promo:PanelProps', component: promo.Panel },
        [TSkin.Electric]: { type: '@epam/uui:PanelProps', component: electric.Panel },
    },
    doc: (doc: DocBuilder<promo.PanelProps | loveship.PanelProps | uui.PanelProps>) => {
        doc.merge('children', { examples: childrenExamples });
        doc.merge('shadow', { examples: [{ value: true, isDefault: true }] });
    },
};

export const PanelDocItem: DocItem = {
    id: 'panel',
    name: 'Panel',
    parentId: 'flexItems',
    order: 1,
    examples: [
        { descriptionPath: 'panel-description' },
        { componentPath: './_examples/flexItems/Panel.example.tsx' },
    ],
    explorerConfig: panelExplorerConfig,
};

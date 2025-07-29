import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { childrenExamples } from './panelExamples';

export const PanelConfig: TDocConfig = {
    id: 'panel',
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

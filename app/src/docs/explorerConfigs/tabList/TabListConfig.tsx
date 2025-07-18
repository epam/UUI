import * as uui from '@epam/uui';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { tabListExamples } from './tabListExamples';
import { IControlled } from '@epam/uui-core';

export const TabListConfig: TDocConfig = {
    id: 'tabList',
    name: 'TabList',
    contexts: [TDocContext.Resizable],
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:TabListProps', component: uui.TabList },
    },
    doc: (doc: DocBuilder<uui.AccordionProps & IControlled<boolean>>) => {
        doc.merge('children', { examples: tabListExamples });
    },
};

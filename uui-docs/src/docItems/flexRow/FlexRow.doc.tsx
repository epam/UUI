import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '../../';
import { flexRowChildren } from './flexRowExamples';
import { DocItem } from '../_types/docItem';

export const flexRowExplorerConfig: TDocConfig = {
    name: 'FlexRow',
    contexts: [TDocContext.Default, TDocContext.Resizable],
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:FlexRowProps', component: uui.FlexRow },
        [TSkin.Electric]: { type: '@epam/uui:FlexRowProps', component: electric.FlexRow },
        [TSkin.Loveship]: { type: '@epam/loveship:FlexRowProps', component: loveship.FlexRow },
        [TSkin.Promo]: { type: '@epam/promo:FlexRowProps', component: promo.FlexRow },
    },
    doc: (doc: DocBuilder<uui.FlexRowProps | loveship.FlexRowProps | promo.FlexRowProps>) => {
        doc.merge('children', { examples: flexRowChildren });
        doc.merge('alignItems', { examples: ['normal', 'stretch', 'center', 'start', 'end', 'flex-start', 'flex-end', 'self-start', 'self-end', 'baseline', 'first baseline', 'last baseline', 'safe center', 'unsafe center'], editorType: 'StringWithExamplesEditor' });
        doc.merge('justifyContent', { examples: ['normal', 'flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly', 'stretch', 'start', 'end', 'left', 'right', 'safe center', 'unsafe center'], editorType: 'StringWithExamplesEditor' });
    },
};

export const FlexRowDocItem: DocItem = {
    id: 'flexRow',
    name: 'Flex Row',
    parentId: 'flexItems',
    order: 2,
    examples: [
        { descriptionPath: 'flexRow-description' },
        { componentPath: './_examples/common/Card.example.tsx' },
    ],
    explorerConfig: flexRowExplorerConfig,
};

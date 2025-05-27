import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { DocItem } from '../documents/structure';

export const textPlaceholderExplorerConfig: TDocConfig = {
    name: 'TextPlaceholder',
    contexts: [TDocContext.Default, TDocContext.Resizable, TDocContext.Form],
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:TextPlaceholderProps', component: uui.TextPlaceholder },
        [TSkin.Electric]: { type: '@epam/uui:TextPlaceholderProps', component: electric.TextPlaceholder },
        [TSkin.Loveship]: { type: '@epam/uui:TextPlaceholderProps', component: loveship.TextPlaceholder },
        [TSkin.Promo]: { type: '@epam/uui:TextPlaceholderProps', component: promo.TextPlaceholder },
    },
    doc: (doc: DocBuilder<uui.TextPlaceholderProps>) => {
        doc.merge('wordsCount', { examples: [2, 3, 4, 5, 6, 12, 150] });
    },
};

export const TextPlaceholderDocItem: DocItem = {
    id: 'textPlaceholder',
    name: 'Text Placeholder',
    parentId: 'components',
    examples: [
        { descriptionPath: 'textPlaceholder-descriptions' },
        { name: 'Basic', componentPath: './_examples/textPlaceholder/Basic.example.tsx' },
    ],
    explorerConfig: textPlaceholderExplorerConfig,
};

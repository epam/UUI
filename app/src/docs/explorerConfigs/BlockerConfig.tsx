import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BlockerProps } from '@epam/uui-components';

export const BlockerConfig: TDocConfig = {
    id: 'blocker',
    name: 'Blocker',
    contexts: [TDocContext.RelativePanel],
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui-components:BlockerProps', component: uui.Blocker },
        [TSkin.Loveship]: { type: '@epam/uui-components:BlockerProps', component: loveship.Blocker },
        [TSkin.Promo]: { type: '@epam/uui-components:BlockerProps', component: promo.Blocker },
        [TSkin.Electric]: { type: '@epam/uui-components:BlockerProps', component: electric.Blocker },
    },
    doc: (doc: DocBuilder<BlockerProps>) => {
        doc.merge('inset', {
            editorType: 'JsonEditor',
            examples: [
                { value: { top: 10, left: 10, right: 10, bottom: 10 }, name: 'Custom' },
            ],
        });
    },
};

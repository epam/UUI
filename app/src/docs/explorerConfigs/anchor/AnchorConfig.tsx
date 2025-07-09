import * as React from 'react';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as uui from '@epam/uui';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TSkin } from '@epam/uui-docs';
import { AnchorProps } from '@epam/uui-components';
import { CardExample } from './cardExample';

export const AnchorConfig: TDocConfig = {
    id: 'anchor',
    name: 'Anchor',
    bySkin: {
        [TSkin.Loveship]: { type: '@epam/uui-components:AnchorProps', component: loveship.Anchor },
        [TSkin.Promo]: { type: '@epam/uui-components:AnchorProps', component: promo.Anchor },
        [TSkin.UUI]: { type: '@epam/uui-components:AnchorProps', component: uui.Anchor },
        [TSkin.Electric]: { type: '@epam/uui-components:AnchorProps', component: electric.Anchor },
    },
    doc: (doc: DocBuilder<AnchorProps>) => {
        doc.setDefaultPropExample('href', (_, index) => index === 0);
        doc.merge('children', {
            examples: [{ name: 'card', value: <CardExample />, isDefault: true }, { name: 'text', value: 'Hello, World!' }],
        });
    },
};

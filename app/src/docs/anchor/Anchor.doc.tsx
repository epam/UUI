import * as React from 'react';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as uui from '@epam/uui';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TSkin } from '@epam/uui-docs';
import { AnchorProps } from '@epam/uui-components';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../../common';
import { CardExample } from './cardExample';

export class AnchorDoc extends BaseDocsBlock {
    title = 'Anchor';

    static override config: TDocConfig = {
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

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="anchor-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="With block nodes" path="./_examples/anchor/Basic.example.tsx" />
                <DocExample title="In text" path="./_examples/anchor/AnchorInText.example.tsx" />
            </>
        );
    }
}

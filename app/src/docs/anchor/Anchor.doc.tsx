import * as React from 'react';
import { AnchorProps } from '@epam/uui-components';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as uui from '@epam/uui';
import {
    EditableDocContent, DocExample, BaseDocsBlock, TSkin,
} from '../../common';
import { TDocConfig } from '../../common/docs/docBuilderGen/types';
import { DocBuilder } from '@epam/uui-docs';
import { CardExample } from './cardExample';

export class AnchorDoc extends BaseDocsBlock {
    title = 'Anchor';

    override config: TDocConfig = {
        name: 'Anchor',
        bySkin: {
            [TSkin.UUI3_loveship]: { type: '@epam/uui-components:AnchorProps', component: loveship.Anchor },
            [TSkin.UUI4_promo]: { type: '@epam/uui-components:AnchorProps', component: promo.Anchor },
            [TSkin.UUI]: { type: '@epam/uui-components:AnchorProps', component: uui.Anchor },
        },
        doc: (doc: DocBuilder<AnchorProps>) => {
            doc.merge('children', {
                examples: [
                    { name: 'card', value: <CardExample />, isDefault: true },
                    { name: 'text', value: 'Hello, World!' },
                ],
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

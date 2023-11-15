import * as React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { AvatarProps } from '@epam/uui-components';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as uui from '@epam/uui';
import { BaseDocsBlock, DocExample, EditableDocContent, TSkin } from '../common';
import { TDocConfig } from '../common/docs/docBuilderGen/types';

export class AvatarDoc extends BaseDocsBlock {
    title = 'Avatar';

    override config: TDocConfig = {
        name: 'Avatar',
        bySkin: {
            [TSkin.UUI3_loveship]: { type: '@epam/uui-components:AvatarProps', component: loveship.Avatar },
            [TSkin.UUI4_promo]: { type: '@epam/uui-components:AvatarProps', component: promo.Avatar },
            [TSkin.UUI]: { type: '@epam/uui-components:AvatarProps', component: uui.Avatar },
        },
        doc: (doc: DocBuilder<AvatarProps>) => {
            doc.merge('img', {
                examples: [
                    {
                        name: 'Olivia',
                        value: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4',
                        isDefault: true,
                    },
                ],
            });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="avatar-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/avatar/Basic.example.tsx" />
            </>
        );
    }
}

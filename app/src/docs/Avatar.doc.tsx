import * as React from 'react';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as uui from '@epam/uui';
import { DocBuilder, TDocConfig, TSkin } from '@epam/uui-docs';
import { AvatarProps } from '@epam/uui-components';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

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

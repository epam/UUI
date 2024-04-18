import * as React from 'react';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as uui from '@epam/uui';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TSkin } from '@epam/uui-docs';
import { AvatarProps } from '@epam/uui-components';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class AvatarDoc extends BaseDocsBlock {
    title = 'Avatar';

    static override config: TDocConfig = {
        name: 'Avatar',
        bySkin: {
            [TSkin.Loveship]: { type: '@epam/uui-components:AvatarProps', component: loveship.Avatar },
            [TSkin.Promo]: { type: '@epam/uui-components:AvatarProps', component: promo.Avatar },
            [TSkin.UUI]: { type: '@epam/uui-components:AvatarProps', component: uui.Avatar },
            [TSkin.Electric]: { type: '@epam/uui-components:AvatarProps', component: electric.Avatar },
        },
        doc: (doc: DocBuilder<AvatarProps>) => {
            doc.setDefaultPropExample('size', ({ value }) => value === '48');
            doc.merge('img', {
                editorType: 'SingleUnknownEditor',
                examples: [
                    {
                        name: 'Olivia',
                        value: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4',
                        isDefault: true,
                    },
                ],
            });
            doc.merge('size', { editorType: 'NumEditor', examples: [36, 12, 18, 24, 30, 42, 54, 60, 72, 78, 90, 96, 120, 144] });
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

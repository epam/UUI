import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as uui from '@epam/uui';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TSkin } from '../';
import { AvatarProps } from '@epam/uui-components';
import { DocItem } from './_types/docItem';

export const avatarExplorerConfig: TDocConfig = {
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
    },
};

export const AvatarDocItem: DocItem = {
    id: 'avatar',
    name: 'Avatar',
    parentId: 'components',
    examples: [
        { descriptionPath: 'avatar-descriptions' },
        { name: 'Basic', componentPath: './_examples/avatar/Basic.example.tsx' },
    ],
    explorerConfig: avatarExplorerConfig,
};

import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { DocBuilder } from '@epam/uui-docs';
import { AvatarStackProps } from '@epam/uui-components';
import { uuiMarkers } from '@epam/uui-core';
import {
    BaseDocsBlock, DocExample, EditableDocContent, TSkin,
} from '../common';
import { TDocConfig } from '../common/docs/docBuilderGen/types';

export class AvatarStackDoc extends BaseDocsBlock {
    title = 'AvatarStack';

    override config: TDocConfig = {
        name: 'AvatarStack',
        bySkin: {
            [TSkin.UUI3_loveship]: { type: '@epam/uui-components:AvatarStackProps', component: loveship.AvatarStack },
            [TSkin.UUI4_promo]: { type: '@epam/uui-components:AvatarStackProps', component: promo.AvatarStack },
            [TSkin.UUI]: { type: '@epam/uui-components:AvatarStackProps', component: uui.AvatarStack },
        },
        doc: (doc: DocBuilder<AvatarStackProps>) => {
            doc.merge('urlArray', {
                examples: [
                    {
                        name: 'Olivia',
                        value: [
                            'https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4',
                            'https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4',
                            'https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4',
                        ],
                        isDefault: true,
                    },
                ],
            });
            doc.merge('renderItem', {
                examples: [
                    {
                        value: (url) => (
                            // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                            <img
                                src={ url }
                                alt="avatar"
                                width={ 36 }
                                height={ 36 }
                                onClick={ () => {
                                    /* eslint-disable-next-line no-console */
                                    console.log('handleClick');
                                } }
                                className={ uuiMarkers.clickable }
                            />
                        ),
                        name: '(url) => <CustomAvatarItem />',
                        isDefault: false,
                    },
                ],
            });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="avatarStack-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/avatarStack/Basic.example.tsx" />
                <DocExample title="With custom avatar" path="./_examples/avatarStack/RenderItem.example.tsx" />
            </>
        );
    }
}

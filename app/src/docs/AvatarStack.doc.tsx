import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TSkin } from '@epam/uui-docs';
import { AvatarStackProps } from '@epam/uui-components';
import { uuiMarkers } from '@epam/uui-core';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class AvatarStackDoc extends BaseDocsBlock {
    title = 'AvatarStack';

    static override config: TDocConfig = {
        name: 'AvatarStack',
        bySkin: {
            [TSkin.Loveship]: { type: '@epam/uui-components:AvatarStackProps', component: loveship.AvatarStack },
            [TSkin.Promo]: { type: '@epam/uui-components:AvatarStackProps', component: promo.AvatarStack },
            [TSkin.UUI]: { type: '@epam/uui-components:AvatarStackProps', component: uui.AvatarStack },
            [TSkin.Electric]: { type: '@epam/uui-components:AvatarStackProps', component: electric.AvatarStack },
        },
        doc: (doc: DocBuilder<AvatarStackProps>) => {
            doc.setDefaultPropExample('avatarSize', ({ value }) => value === '48');
            doc.merge('urlArray', {
                examples: [
                    {
                        name: 'Olivia',
                        value: new Array(3).fill('https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4'),
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
                                onClick={ () => {} }
                                className={ uuiMarkers.clickable }
                            />
                        ),
                        name: '(url) => React.ReactElement',
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

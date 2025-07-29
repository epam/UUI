import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, DocPreviewBuilder, TDocConfig, TSkin, TAvatarStackPreview } from '@epam/uui-docs';
import { AvatarStackProps } from '@epam/uui-components';
import { uuiMarkers } from '@epam/uui-core';
import { ALL_AVATARS } from './avatarsExamples';

export const AvatarStackConfig: TDocConfig = {
    id: 'avatarStack',
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
                    value: ALL_AVATARS,
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
    preview: (docPreview: DocPreviewBuilder<AvatarStackProps>) => {
        docPreview.add({
            id: TAvatarStackPreview['Sizes'],
            matrix: {
                avatarSize: { examples: '*' },
                avatarsCount: { values: [undefined, 2] },
                direction: { examples: '*' },
            },
            cellSize: '400-160',
        });
    },
};

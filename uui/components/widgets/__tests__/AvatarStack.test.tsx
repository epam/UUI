import React from 'react';
import { AvatarStack } from '../AvatarStack';
import { renderer } from '@epam/uui-test-utils';

describe('AvatarStack', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(
                <AvatarStack
                    avatarsCount={ 3 }
                    urlArray={ Array(5).fill('https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4') }
                    avatarSize="36"
                    direction="right"
                />,
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

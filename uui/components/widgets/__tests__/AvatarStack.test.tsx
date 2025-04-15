import React from 'react';
import { render } from '@epam/uui-test-utils';
import { AvatarStack } from '../AvatarStack';

describe('AvatarStack', () => {
    it('should be rendered correctly', () => {
        const { asFragment } = render(
            <AvatarStack
                avatarsCount={ 3 }
                urlArray={ Array(5).fill('https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4') }
                avatarSize="36"
                direction="right"
            />,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});

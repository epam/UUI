import React from 'react';
import { AvatarStack } from '../AvatarStack';
import renderer from 'react-test-renderer';

describe('AvatarStack', () => {
    it('should be rendered correctly', () => {

        const tree = renderer
            .create(<AvatarStack
                avatarsCount={ 3 }
                urlArray={ Array(5).fill('https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50') }
                avatarSize='36'
                direction='right'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


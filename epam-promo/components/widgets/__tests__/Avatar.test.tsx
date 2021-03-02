import React from 'react';
import { Avatar } from '../Avatar';
import renderer from 'react-test-renderer';

describe('Avatar', () => {
    it('should be rendered correctly', () => {

        const tree = renderer
            .create(<Avatar
                img={ 'https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50' }
                size='36'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {

        const tree = renderer
            .create(<Avatar
                img={ 'https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50' }
                size='36'
                alt='Test avatar'
                isLoading={ true }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


import React from 'react';
import { renderer } from '@epam/uui-test-utils';
import { AvatarRow } from '../AvatarRow';

describe('AvatarRow', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<AvatarRow img="https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4" size="42" />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

import React from 'react';
import { renderer } from '@epam/uui-test-utils';
import { Blocker } from '../Blocker';

describe('Blocker', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<Blocker isEnabled />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

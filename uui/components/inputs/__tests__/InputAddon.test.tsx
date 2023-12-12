import React from 'react';
import { renderer } from '@epam/uui-test-utils';
import { InputAddon } from '../InputAddon';

describe('InputAddon', () => {
    describe('InputAddon', () => {
        it('should be rendered correctly', () => {
            const tree = renderer.create(<InputAddon content="Test Content" cx="custom-class" />).toJSON();
            expect(tree).toMatchSnapshot();
        });
    });
});

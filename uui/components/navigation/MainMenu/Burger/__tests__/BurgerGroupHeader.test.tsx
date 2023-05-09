import React from 'react';
import { BurgerGroupHeader } from '../BurgerGroupHeader';
import { renderer } from '@epam/uui-test-utils';

describe('BurgerSearch', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<BurgerGroupHeader caption="Test" />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

import React from 'react';
import { BurgerGroupHeader } from '../BurgerGroupHeader';
import { render } from '@epam/uui-test-utils';

describe('BurgerSearch', () => {
    it('should be rendered correctly', () => {
        const { asFragment } = render(<BurgerGroupHeader caption="Test" />);
        expect(asFragment()).toMatchSnapshot();
    });
});

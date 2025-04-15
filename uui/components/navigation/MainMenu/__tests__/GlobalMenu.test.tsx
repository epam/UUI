import React from 'react';
import { render } from '@epam/uui-test-utils';
import { GlobalMenu } from '../GlobalMenu';

describe('GlobalMenu', () => {
    it('should be rendered correctly', () => {
        const { asFragment } = render(<GlobalMenu />);
        expect(asFragment()).toMatchSnapshot();
    });
});

import React from 'react';
import { render } from '@epam/uui-test-utils';
import { InputAddon } from '../InputAddon';

describe('InputAddon', () => {
    it('should be rendered correctly', () => {
        const { asFragment } = render(<InputAddon content="Test Content" cx="custom-class" />);
        expect(asFragment()).toMatchSnapshot();
    });
});

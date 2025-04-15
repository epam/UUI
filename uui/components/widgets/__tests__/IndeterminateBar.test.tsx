import React from 'react';
import { IndeterminateBar } from '../IndeterminateBar';
import { render } from '@epam/uui-test-utils';

describe('ProgressBar', () => {
    it('should be rendered correctly', () => {
        const { asFragment } = render(<IndeterminateBar />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const { asFragment } = render(<IndeterminateBar size="24" />);
        expect(asFragment()).toMatchSnapshot();
    });
});

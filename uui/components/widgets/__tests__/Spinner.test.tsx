import React from 'react';
import { Spinner } from '../Spinner';
import { render } from '@epam/uui-test-utils';

describe('Spinner', () => {
    it('should be rendered correctly', () => {
        const { asFragment } = render(<Spinner />);
        expect(asFragment()).toMatchSnapshot();
    });
});

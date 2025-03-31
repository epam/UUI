import React from 'react';
import { render } from '@epam/uui-test-utils';
import { StatusIndicator } from '../StatusIndicator';

describe('StatusIndicator', () => {
    it('should be rendered correctly', () => {
        const { asFragment } = render(<StatusIndicator caption="Indicator" />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const { asFragment } = render(
            <StatusIndicator caption="Indicator" color="info" fill="outline" size="12" />,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});

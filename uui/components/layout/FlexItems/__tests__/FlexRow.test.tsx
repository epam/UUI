import React from 'react';
import { FlexRow } from '../FlexRow';
import { render } from '@epam/uui-test-utils';

describe('FlexRow', () => {
    it('should be rendered correctly', () => {
        const { asFragment } = render(<FlexRow />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const { asFragment } = render(<FlexRow
            onClick={ () => {} }
            margin="12"
            size="24"
            padding="12"
            borderBottom
            alignItems="top"
            topShadow
            vPadding="12"
            rowGap="24"
            columnGap="24"
            borderTop={ true }
            justifyContent="center"
            cx="some class"
            rawProps={ { id: '123' } }
            key="key"
            background="surface-main"
        />);
        expect(asFragment()).toMatchSnapshot();
    });
});

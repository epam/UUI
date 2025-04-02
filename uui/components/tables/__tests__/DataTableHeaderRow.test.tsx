import React from 'react';
import { DataTableHeaderRow } from '../DataTableHeaderRow';
import { render } from '@epam/uui-test-utils';

describe('DataTableHeaderRow', () => {
    it('should be rendered correctly', () => {
        const { asFragment } = render(<DataTableHeaderRow value={ { } } onValueChange={ jest.fn } columns={ [] } />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should be rendered with props correctly', () => {
        const { asFragment } = render(
            <DataTableHeaderRow
                value={ {
                    topIndex: 0,
                    visibleCount: 10,
                } }
                onValueChange={ jest.fn }
                columns={ [] }
                size="48"
                textCase="upper"
            />,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});

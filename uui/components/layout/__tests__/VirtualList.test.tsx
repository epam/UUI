import React from 'react';
import { VirtualList } from '../VirtualList';
import { render } from '@epam/uui-test-utils';

describe('VirtualList', () => {
    it('should be rendered correctly', () => {
        const { asFragment } = render(<VirtualList rows={ [] } value={ { topIndex: 0, visibleCount: 20 } } onValueChange={ () => {} } />);
        expect(asFragment()).toMatchSnapshot();
    });
});

import React from 'react';
import { FlexCell } from '../FlexCell';
import { render } from '@epam/uui-test-utils';

describe('FlexCell', () => {
    it('should be rendered correctly', () => {
        const { asFragment } = render(<FlexCell />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const { asFragment } = render(<FlexCell onClick={ () => {} } width="100%" minWidth={ 120 } alignSelf="center" grow={ 1 } shrink={ 1 } textAlign="left" />);
        expect(asFragment()).toMatchSnapshot();
    });
});

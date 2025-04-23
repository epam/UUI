import React from 'react';
import { IndicatorBar } from '../IndicatorBar';
import { render } from '@epam/uui-test-utils';

describe('IndicatorBar', () => {
    it('should be rendered correctly', () => {
        const { asFragment } = render(<IndicatorBar />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const { asFragment } = render(<IndicatorBar progress={ 20 } />);
        expect(asFragment()).toMatchSnapshot();
    });
});

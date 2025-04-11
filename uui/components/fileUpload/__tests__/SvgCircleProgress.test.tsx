import React from 'react';
import { SvgCircleProgress } from '../SvgCircleProgress';
import { render } from '@epam/uui-test-utils';

describe('SvgCircleProgress', () => {
    it('should be rendered correctly', () => {
        const { asFragment } = render(<SvgCircleProgress progress={ 35 } size={ 30 } />);
        expect(asFragment()).toMatchSnapshot();
    });
});

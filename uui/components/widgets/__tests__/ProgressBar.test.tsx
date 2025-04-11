import React from 'react';
import { ProgressBar } from '../ProgressBar';
import { render } from '@epam/uui-test-utils';

describe('ProgressBar', () => {
    it('should be rendered correctly', () => {
        const { asFragment } = render(<ProgressBar progress={ 20 } />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should be rendered correctly without label', () => {
        const { asFragment } = render(<ProgressBar size="18" progress={ 56 } hideLabel />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should be rendered correctly with custom label', () => {
        const { asFragment } = render(<ProgressBar size="18" progress={ 56 } label="5/10" />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should be rendered correctly with striped animation', () => {
        const { asFragment } = render(<ProgressBar size="18" progress={ 56 } striped />);
        expect(asFragment()).toMatchSnapshot();
    });
});

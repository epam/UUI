import React from 'react';
import { ProgressBar } from '../ProgressBar';
import { renderer } from '@epam/uui-test-utils';

describe('ProgressBar', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<ProgressBar progress={ 20 } />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly without label', () => {
        const tree = renderer.create(<ProgressBar size="18" progress={ 56 } hideLabel />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with custom label', () => {
        const tree = renderer.create(<ProgressBar size="18" progress={ 56 } label="5/10" />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with striped animation', () => {
        const tree = renderer.create(<ProgressBar size="18" progress={ 56 } striped />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

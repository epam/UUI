import React from 'react';
import { IndeterminateBar } from '../IndeterminateBar';
import { renderer } from '@epam/uui-test-utils';

describe('ProgressBar', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<IndeterminateBar />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer.create(<IndeterminateBar size="24" />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

import React from 'react';
import { RadioInput } from '../RadioInput';
import { renderer } from '@epam/uui-test-utils';

describe('RadioInput', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<RadioInput value={ null } onValueChange={ jest.fn } />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer.create(<RadioInput value={ null } onValueChange={ jest.fn } size="18" label="Open" />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

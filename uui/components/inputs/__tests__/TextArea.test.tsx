import React from 'react';
import { TextArea } from '../TextArea';
import { renderer } from '@epam/uui-test-utils';

describe('TextArea', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<TextArea value={ null } onValueChange={ jest.fn } />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer.create(<TextArea value={ null } onValueChange={ jest.fn } placeholder="Type here" size="36" maxLength={ 200 } rows={ 4 } mode="inline" />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

import React from 'react';
import { TextArea } from '../TextArea';
import { render } from '@epam/uui-test-utils';

describe('TextArea', () => {
    it('should be rendered correctly', () => {
        const { asFragment } = render(<TextArea value="" onValueChange={ jest.fn } />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should be rendered with props correctly', () => {
        const { asFragment } = render(<TextArea value="" onValueChange={ jest.fn } placeholder="Type here" size="36" maxLength={ 200 } rows={ 4 } mode="inline" />);
        expect(asFragment()).toMatchSnapshot();
    });
});

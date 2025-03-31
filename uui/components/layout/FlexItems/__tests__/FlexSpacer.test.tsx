import React from 'react';
import { FlexSpacer } from '../';
import { render } from '@epam/uui-test-utils';

describe('FlexSpacer', () => {
    it('should be rendered correctly', () => {
        const { asFragment } = render(<FlexSpacer />);
        expect(asFragment()).toMatchSnapshot();
    });
});

import React from 'react';
import { FlexSpacer } from '../';
import { renderer } from '@epam/uui-test-utils';

describe('FlexSpacer', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<FlexSpacer />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

import React from 'react';
import { Spinner } from '../Spinner';
import { renderer } from '@epam/uui-test-utils';

describe('Spinner', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<Spinner />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

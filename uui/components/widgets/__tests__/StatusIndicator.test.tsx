import React from 'react';
import { renderer } from '@epam/uui-test-utils';
import { StatusIndicator } from '../StatusIndicator';

describe('StatusIndicator', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<StatusIndicator />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer.create(
            <StatusIndicator color="info" fill="outline" size="12" />,
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

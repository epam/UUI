import React from 'react';
import { Text } from '../Text';
import { renderer } from '@epam/uui-test-utils';

describe('Text', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<Text>Test</Text>).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer
            .create(
                <Text color="primary" size="48" fontSize="24" lineHeight="30" onClick={ jest.fn } rawProps={ { style: { marginRight: '12' } } }>
                    Test
                </Text>,
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

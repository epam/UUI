import React from 'react';
import { Text } from '../Text';
import renderer from 'react-test-renderer';

describe('Text', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<Text>Test</Text>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<Text
                color='gray60'
                size='48'
                font='museo-slab'
                fontSize='24'
                lineHeight='30'
                onClick={ jest.fn }
            >
                Test
            </Text>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});



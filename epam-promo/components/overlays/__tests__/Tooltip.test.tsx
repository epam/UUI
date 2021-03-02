import React from 'react';
import { Tooltip } from '../Tooltip';
import renderer from 'react-test-renderer';

jest.mock('react-dom', () => ({
    findDOMNode: jest.fn(),
}));

describe('Tooltip', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<Tooltip>
                { 'Test' }
            </Tooltip>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<Tooltip
                color='gray90'
                content='Test'
                trigger='click'
            >
                { 'Test' }
            </Tooltip>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});



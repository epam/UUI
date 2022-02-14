import React from 'react';
import { Tooltip } from '../Tooltip';
import { renderWithContextAsync } from '@epam/test-utils';

describe('Tooltip', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderWithContextAsync(
            <Tooltip>Test</Tooltip>
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', async () => {
        const tree = await renderWithContextAsync(
            <Tooltip
                color='gray90'
                content='Test'
                trigger='click'
            >
                { 'Test' }
            </Tooltip>
        );

        expect(tree).toMatchSnapshot();
    });
});



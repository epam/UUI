import React from 'react';
import { Tooltip } from '../Tooltip';
import { renderSnapshotWithContextAsync } from '@epam/test-utils';

describe('Tooltip', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<Tooltip>Test</Tooltip>);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <Tooltip color="contrast" content="Test" trigger="click">
                Test
            </Tooltip>,
        );

        expect(tree).toMatchSnapshot();
    });
});

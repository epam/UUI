import React from 'react';
import { Tooltip } from '../Tooltip';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

describe('Tooltip', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<Tooltip>Test</Tooltip>);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <Tooltip color="neutral" content="Test">
                Test
            </Tooltip>,
        );

        expect(tree).toMatchSnapshot();
    });
});

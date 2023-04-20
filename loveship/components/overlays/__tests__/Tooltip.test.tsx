import React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/test-utils';
import { Tooltip } from '../Tooltip';

describe('Tooltip', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<Tooltip>{'Test'}</Tooltip>);

        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <Tooltip color="sun" content="Test content" trigger="click">
                Test
            </Tooltip>
        );

        expect(tree).toMatchSnapshot();
    });
});

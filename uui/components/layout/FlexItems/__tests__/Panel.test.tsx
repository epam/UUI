import React from 'react';
import { Panel } from '../Panel';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

describe('Panel', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<Panel />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', async () => {
        const tree = await renderSnapshotWithContextAsync(<Panel onClick={ () => {} } margin="24" shadow />);
        expect(tree).toMatchSnapshot();
    });
});

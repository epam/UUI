import React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { Blocker } from '../Blocker';

describe('Blocker', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<Blocker isEnabled />);
        expect(tree).toMatchSnapshot();
    });
});

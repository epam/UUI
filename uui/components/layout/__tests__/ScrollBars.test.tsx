import React from 'react';
import { ScrollBars } from '../ScrollBars';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { Button } from '../../buttons';

describe('ScrollBars', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <ScrollBars>
                <Button />
            </ScrollBars>,
        );
        expect(tree).toMatchSnapshot();
    });
});

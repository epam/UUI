import React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { ControlGroup } from '../ControlGroup';
import { Button } from '../../buttons';

describe('ControlGroup', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <ControlGroup>
                <Button caption="On" />
                <Button caption="Off" color="primary" />
            </ControlGroup>,
        );
        expect(tree).toMatchSnapshot();
    });
});

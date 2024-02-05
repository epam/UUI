import React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { Anchor } from '../Anchor';

describe('Anchor', () => {
    it('should rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<Anchor href="#">Test Anchor</Anchor>);
        expect(tree).toMatchSnapshot();
    });

    it('should rendered with props correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <Anchor href="https://uui.epam.com" isDisabled={ true }>
                Test Anchor
            </Anchor>,
        );
        expect(tree).toMatchSnapshot();
    });
});

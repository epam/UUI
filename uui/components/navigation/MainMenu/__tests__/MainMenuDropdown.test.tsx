import React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { MainMenuDropdown } from '../MainMenuDropdown';
import { MainMenuButton } from '../MainMenuButton';

describe('MainMenuDropdown', () => {
    it('should be rendered correctly with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(<MainMenuDropdown />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <MainMenuDropdown caption="Test button" estimatedWidth={ 120 } priority={ 6 }>
                <MainMenuButton collapseToMore caption="Impact" />
                <MainMenuButton collapseToMore caption="ENGX" />
                <MainMenuButton collapseToMore caption="Cloud" />
            </MainMenuDropdown>,
        );
        expect(tree).toMatchSnapshot();
    });
});

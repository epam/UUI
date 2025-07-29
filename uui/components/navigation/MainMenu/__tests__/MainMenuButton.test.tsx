import React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { MainMenuButton } from '../MainMenuButton';

describe('MainMenuButton', () => {
    it('should be rendered correctly with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(<MainMenuButton />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <MainMenuButton
                caption="Test button"
                type="primary"
                target="_blank"
                link={ { pathname: '/' } }
                isActive
                isDropdown
                isOpen={ false }
                collapseToMore
                estimatedWidth={ 120 }
                showInBurgerMenu
                priority={ 6 }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});

import React from 'react';
import { MainMenuSearch } from '../MainMenuSearch';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

describe('MainMenuSearch', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<MainMenuSearch value={ null } onValueChange={ jest.fn } />);

        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <MainMenuSearch
                value="test"
                onValueChange={ jest.fn }
                type="primary"
                collapseToMore
                estimatedWidth={ 120 }
                showInBurgerMenu
                priority={ 6 }
            />,
        );

        expect(tree).toMatchSnapshot();
    });
});

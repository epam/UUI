import React from 'react';
import { MainMenuSearch } from '../MainMenuSearch';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

describe('MainMenuSearch', () => {
    it('should be rendered correctly with null value', async () => {
        const tree = await renderSnapshotWithContextAsync(<MainMenuSearch value={ undefined } onValueChange={ jest.fn } />);

        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with value and extra props', async () => {
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

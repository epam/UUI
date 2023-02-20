import * as React from 'react';
import { renderWithContextAsync } from '@epam/test-utils';
import { MainMenuSearch } from '../MainMenuSearch';

describe('MainMenuSearch', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderWithContextAsync(<MainMenuSearch value="test" onValueChange={jest.fn()} />);

        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', async () => {
        const tree = await renderWithContextAsync(
            <MainMenuSearch
                value="test"
                onValueChange={jest.fn()}
                caption="Test button"
                type="primary"
                collapseToMore
                estimatedWidth={120}
                showInBurgerMenu
                priority={6}
            />
        );

        expect(tree).toMatchSnapshot();
    });
});

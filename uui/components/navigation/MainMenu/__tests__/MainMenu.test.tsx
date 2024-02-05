import React from 'react';
import { MainMenu } from '../MainMenu';
import { MainMenuButton } from '../MainMenuButton';
import { BurgerButton } from '../Burger';
import ReactDOM from 'react-dom';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

describe('MainMenu', () => {
    const oldPortal = ReactDOM.createPortal;

    beforeAll(() => {
        ReactDOM.createPortal = (node) => node as any;
    });

    afterAll(() => {
        ReactDOM.createPortal = oldPortal;
    });

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <MainMenu>
                <MainMenuButton />
            </MainMenu>,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <MainMenu
                renderBurger={ () => <BurgerButton /> }
                logoLink={ { pathname: '/' } }
                appLogoUrl=""
                isTransparent
                serverBadge="Dev"
            >
                <MainMenuButton />
            </MainMenu>,
        );

        expect(tree).toMatchSnapshot();
    });
});

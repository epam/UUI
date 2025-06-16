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

    it('should be rendered correctly with default props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <MainMenu
                items={ [
                    {
                        id: 'btn',
                        render: () => <MainMenuButton />,
                        priority: 0,
                    },
                ] }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with burger, logo, transparency and serverBadge', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <MainMenu
                renderBurger={ () => <BurgerButton /> }
                logoLink={ { pathname: '/' } }
                appLogoUrl=""
                serverBadge="Dev"
                items={ [
                    {
                        id: 'btn',
                        render: () => <MainMenuButton />,
                        priority: 0,
                    },
                ] }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});

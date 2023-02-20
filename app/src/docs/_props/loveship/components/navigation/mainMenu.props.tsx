import React from 'react';
import { MainMenuMods, MainMenu, MainMenuButton, FlexSpacer, GlobalMenu, BurgerButton } from '@epam/loveship';
import { MainMenuLogo, MainMenuProps } from '@epam/uui-components';
import { DocBuilder } from '@epam/uui-docs';
import { ResizableContext } from '../../docs';

const mainMenuDoc = new DocBuilder<MainMenuMods & MainMenuProps>({ name: 'MainMenu', component: MainMenu })
    .prop('renderBurger', {
        examples: [
            {
                value: () => (
                    <>
                        <BurgerButton caption="My" />
                        <BurgerButton caption="My Team" />
                        <BurgerButton caption="Skill Matrices" />
                        <BurgerButton caption="Help" />
                        <BurgerButton caption="Settings" />
                        <BurgerButton caption="Log out" />
                    </>
                ),
                name: 'Grow',
                isDefault: true,
            },
        ],
    })
    .prop('children', {
        examples: [
            {
                value: [
                    <MainMenuLogo key="appLogo2" logoUrl="/static/images/app-logos/grow_logo.svg" priority={100500} estimatedWidth={142} />,
                    <MainMenuButton caption="Me" collapseToMore priority={3} estimatedWidth={52} showInBurgerMenu key="me" isLinkActive />,
                    <MainMenuButton caption="My Team" collapseToMore priority={2} estimatedWidth={92} showInBurgerMenu key="my team" />,
                    <MainMenuButton
                        caption="Skill Matrices"
                        collapseToMore
                        priority={1}
                        estimatedWidth={139}
                        showInBurgerMenu
                        key="skill"
                        href="/"
                    />,
                    <FlexSpacer priority={100500} key="spacer" />,
                    <MainMenuButton caption="Tools" type="secondary" isDropdown priority={4} estimatedWidth={113} key="tool" />,
                    <GlobalMenu priority={100500} estimatedWidth={60} key="global-menu" />,
                ],
                name: 'Grow',
                isDefault: true,
            },
            {
                value: [
                    <MainMenuLogo key="appLogo2" logoUrl="/static/images/app-logos/learn_logo.svg" priority={100500} estimatedWidth={142} />,
                    <MainMenuButton
                        key="start"
                        caption="Start"
                        collapseToMore
                        priority={3}
                        estimatedWidth={62}
                        showInBurgerMenu
                        isLinkActive={true}
                    />,
                    <MainMenuButton key="explore" caption="Explore" collapseToMore priority={2} estimatedWidth={78} showInBurgerMenu />,
                    <MainMenuButton
                        key="myLearning"
                        caption="My Learning"
                        collapseToMore
                        priority={2}
                        estimatedWidth={104}
                        showInBurgerMenu
                        href="/"
                    />,
                    <FlexSpacer priority={100500} key="spacer" />,
                    <MainMenuButton key="minsk" caption="Minsk" type="secondary" isDropdown estimatedWidth={70} />,
                    <GlobalMenu priority={100500} estimatedWidth={60} key="global-menu" />,
                ],
                name: 'Learn',
            },
            {
                value: [
                    <MainMenuLogo key="appLogo2" logoUrl="/static/images/app-logos/logo.svg" priority={100500} estimatedWidth={52} />,
                    <MainMenuButton caption="Home" priority={4} collapseToMore estimatedWidth={68} showInBurgerMenu key="home" isLinkActive={true} />,
                    <MainMenuButton caption="Assets" priority={2} collapseToMore estimatedWidth={68} showInBurgerMenu key="assetsButton" />,
                    <MainMenuButton
                        caption="Components"
                        priority={4}
                        collapseToMore
                        estimatedWidth={108}
                        showInBurgerMenu
                        key="components"
                        href="/"
                    />,
                    <MainMenuButton caption="Demos" priority={2} collapseToMore estimatedWidth={72} showInBurgerMenu key="demos" href="/" />,
                    <MainMenuButton caption="Tests" priority={1} collapseToMore estimatedWidth={62} showInBurgerMenu key="tests" href="/" />,
                    <FlexSpacer priority={100500} key="spacer" />,
                    <GlobalMenu priority={100500} estimatedWidth={60} key="global-menu" />,
                ],
                name: 'UI',
            },
        ],
        isRequired: true,
    })
    .withContexts(ResizableContext);

export default mainMenuDoc;

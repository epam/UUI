import React from 'react';
import { useLocation } from "react-router-dom";
import { MainMenu, MainMenuButton } from "@epam/uui";
import logo from '../icons/logo.svg';


export const Menu = () => {
    useLocation();
    return (
        <MainMenu
            appLogoUrl={logo}
            items={[{
                id: 'home',
                render: () => <MainMenuButton caption="Home" link={{ pathname: '/' }} priority={1} estimatedWidth={72} />,
                priority: 1,
            }]}
        />
    )
}
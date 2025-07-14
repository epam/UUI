import { useLocation } from "react-router-dom";
import { MainMenu, MainMenuButton, MainMenuLogo } from "@epam/uui";
import logo from '../icons/logo.svg';


export const Menu = () => {
    useLocation();
    return (
        <MainMenu
            items={[
                {
                    id: 'logo',
                    priority: 100,
                    render: () => <MainMenuLogo logoUrl={logo} />,
                },
                {
                    id: 'home',
                    render: () => <MainMenuButton caption="Home" link={{ pathname: '/' }} priority={1} estimatedWidth={72} />,
                    priority: 1,
                },
            ]}
        />
    )
}
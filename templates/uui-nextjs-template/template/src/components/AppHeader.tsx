import { useCallback } from 'react';
import { Burger, BurgerButton, MainMenu, MainMenuButton, MainMenuLogo } from '@epam/uui';
import logo from '../../icons/logo.svg';

export const AppHeader = () => {
    const handleShowAlert = useCallback(() => {
        alert('Demo alert');
    }, []);

    const handleRenderBurger = useCallback(() => {
        return (
            <BurgerButton
                caption='Show modal dialog'
                onClick={handleShowAlert}
            />
        );
    }, [handleShowAlert]);

    return (
        <MainMenu
            items={[
                {
                    id: 'burger',
                    collapsedContainer: true,
                    priority: 100,
                    render: () => <Burger key='burger' renderBurgerContent={handleRenderBurger} />,
                },
                {
                    id: 'logo',
                    priority: 99,
                    render: () => <MainMenuLogo logoUrl={logo.src} />,
                },

                {
                    id: 'home',
                    render: () => (
                        <MainMenuButton
                            caption='Home'
                            link={{ pathname: '/' }}
                            priority={1}
                            estimatedWidth={72}
                        />
                    ),
                    priority: 1,
                },
            ]}
        />
    );
};

import { BurgerButton, MainMenu, MainMenuButton } from '@epam/uui';
import { useCallback } from 'react';
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
            appLogoUrl={logo.src}
            renderBurger={handleRenderBurger}
            items={[{
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
            }]}
        />
    );
};

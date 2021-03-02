import React from 'react';
import renderer from 'react-test-renderer';
import { MainMenu } from '../MainMenu';
import { MainMenuButton } from '../MainMenuButton';
import { BurgerButton } from '../Burger';

describe('MainMenu', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<MainMenu>
                <MainMenuButton />
            </MainMenu>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<MainMenu
                renderBurger={ () => <BurgerButton /> }
                logoLink={ { pathname: '/' } }
                appLogoUrl=''
                logoWidth={ 120 }
                isTransparent
                serverBadge='Dev'
                tooltipTechInfo='Tech Info'
            >
                <MainMenuButton />
            </MainMenu>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});



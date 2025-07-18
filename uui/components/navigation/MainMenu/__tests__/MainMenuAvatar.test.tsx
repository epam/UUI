import React from 'react';
import { render } from '@epam/uui-test-utils';
import { MainMenuAvatar } from '../MainMenuAvatar';

describe('MainMenuAvatar', () => {
    it('should be rendered correctly', () => {
        const { asFragment } = render(<MainMenuAvatar />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const { asFragment } = render(
            <MainMenuAvatar
                avatarUrl="https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/Images/avatar_placeholder.jpg"
                isDropdown
                isOpen={ false }
                collapseToMore
                estimatedWidth={ 120 }
                showInBurgerMenu
                priority={ 6 }
            />,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});

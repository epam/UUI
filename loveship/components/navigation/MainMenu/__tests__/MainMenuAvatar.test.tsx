import * as React from "react";
import renderer from "react-test-renderer";
import {MainMenuAvatar} from "../MainMenuAvatar";

describe("MainMenuAvatar", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<MainMenuAvatar/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer
            .create(<MainMenuAvatar
                avatarUrl='https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/Images/avatar_placeholder.jpg'
                isDropdown
                isOpen={ false }
                collapseToMore
                estimatedWidth={ 120 }
                showInBurgerMenu
                priority={ 6 }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
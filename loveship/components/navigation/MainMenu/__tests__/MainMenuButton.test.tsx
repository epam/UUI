import * as React from "react";
import renderer from "react-test-renderer";
import {MainMenuButton} from "../MainMenuButton";

describe("MainMenuButton", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<MainMenuButton/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer
            .create(<MainMenuButton
                caption='Test button'
                type='primary'
                target='_blank'
                link={ { pathname: '/' } }
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
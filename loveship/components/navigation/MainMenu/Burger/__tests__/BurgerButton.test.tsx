import React from "react";
import renderer from "react-test-renderer";
import {BurgerButton} from "../BurgerButton";
import * as acceptIcon from "../../../../icons/accept-12.svg";

describe("BurgerButton", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<BurgerButton/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer
            .create(<BurgerButton
                caption='Test button'
                icon={ acceptIcon }
                href='#'
                target='_blank'
                type='secondary'
                isDropdown
                isOpen={ false }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
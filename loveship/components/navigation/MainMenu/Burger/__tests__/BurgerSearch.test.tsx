import React from "react";
import renderer from "react-test-renderer";
import {BurgerSearch} from "../BurgerSearch";
import * as acceptIcon from "../../../../icons/accept-12.svg";

describe("BurgerSearch", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<BurgerSearch value='test' onValueChange={ jest.fn() }/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {
        const tree = renderer
            .create(<BurgerSearch
                value='test' 
                onValueChange={ jest.fn() }
                onAccept={ jest.fn() }
                onCancel={ jest.fn() }
                icon={ acceptIcon }
                iconPosition='right'
                isDropdown
                isOpen
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
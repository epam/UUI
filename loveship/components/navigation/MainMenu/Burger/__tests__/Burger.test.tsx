import React from "react";
import * as ReactDom from "react-dom";
import renderer from "react-test-renderer";
import {Burger} from "../Burger";
import {BurgerButton} from "../BurgerButton";

describe("Burger", () => {
    beforeAll(() => {
        jest.spyOn(ReactDom, "createPortal").mockImplementation((el: any) => el);
    });
    afterAll(() => {
        jest.clearAllMocks();
    });
    
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<Burger
                width={ 50 }
                renderBurgerContent={ ({onClose: {}}) => <BurgerButton caption='Home' link={ {pathname: "/"} }/> }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
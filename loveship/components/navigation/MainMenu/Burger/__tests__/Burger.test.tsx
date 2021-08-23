import React from "react";
import * as ReactDom from "react-dom";
import renderer from "react-test-renderer";
import {Burger} from "../Burger";
import {BurgerButton} from "../BurgerButton";

describe.skip("Burger", () => {
    let reactDomSpy: any;

    beforeEach(() => {
        reactDomSpy = jest
            .spyOn(ReactDom, "createPortal")
            .mockImplementation((el: any) => el);
    });
    afterEach(() => {
        reactDomSpy.mockRestore();
    });

    it("should be rendered correctly", () => {
        // Warning: An invalid container has been provided. This may indicate that another renderer is being used in addition to the test renderer. (For example, ReactDOM.createPortal inside of a ReactTestRenderer tree.) This is not supported.
        const tree = renderer
            .create(<Burger
                width={ 50 }
                renderBurgerContent={ ({onClose: {}}) => <BurgerButton caption='Home' link={ {pathname: "/"} }/> }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
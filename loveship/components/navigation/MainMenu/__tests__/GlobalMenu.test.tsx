import * as React from "react";
import renderer from "react-test-renderer";
import {GlobalMenu} from "../GlobalMenu";

describe("GlobalMenu", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<GlobalMenu/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with props", () => {
        const tree = renderer
            .create(<GlobalMenu
                showInBurgerMenu
                collapseToMore
                estimatedWidth={ 100 }
                priority={ 1 }
                cx={ ["root"] }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
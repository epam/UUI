import React from "react";
import renderer from "react-test-renderer";
import {BurgerGroupHeader} from "../BurgerGroupHeader";

describe("BurgerGroupHeader", () => {
    it("should render with default props", () => {
        const tree = renderer
            .create(<BurgerGroupHeader caption='test'/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
import React from "react";
import renderer from "react-test-renderer";
import {Spinner} from "../Spinner";

describe("Spinner", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<Spinner/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with extra props", () => {
        const tree = renderer
            .create(<Spinner color={ "sun" }/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
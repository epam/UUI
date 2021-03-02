import React from "react";
import renderer from "react-test-renderer";
import {Blocker} from "../Blocker";

describe("Blocker", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<Blocker isEnabled/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with extra props", () => {
        const tree = renderer
            .create(<Blocker isEnabled color="sun"/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
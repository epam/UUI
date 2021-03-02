import React from "react";
import renderer from "react-test-renderer";
import {Tooltip} from "../Tooltip";

jest.mock("react-dom", () => ({
    findDOMNode: jest.fn(),
}));

describe("Tooltip", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<Tooltip>Test</Tooltip>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with props", () => {
        const tree = renderer
            .create(<Tooltip color="sun" content='Test content' trigger='click'>
                Test
            </Tooltip>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
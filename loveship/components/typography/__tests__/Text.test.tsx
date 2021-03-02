import React from "react";
import renderer from "react-test-renderer";
import {Text} from "../Text";

describe("Text", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<Text>Test text</Text>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with extra props", () => {
        const tree = renderer
            .create(<Text
                font="sans-light"
                color="sun"
                size="42"
                fontSize="14"
                lineHeight="30"
                onClick={ jest.fn() }
            >
                Test text
            </Text>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
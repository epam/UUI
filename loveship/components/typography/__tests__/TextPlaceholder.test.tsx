import React from "react";
import renderer from "react-test-renderer";
import {TextPlaceholder} from "../TextPlaceholder";

describe("TextPlaceholder", () => {
    beforeAll(() => {
        jest.spyOn(global.Math, "random").mockReturnValue(0.5);
    });

    afterAll(() => {
        jest.spyOn(global.Math, "random").mockRestore();
    });

    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<TextPlaceholder/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with extra props", () => {
        const tree = renderer
            .create(<TextPlaceholder wordsCount={ 10 }
                                     color="sun"
                                     isNotAnimated/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
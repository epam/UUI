import React from "react";
import renderer from "react-test-renderer";
import {PageButton} from "../PageButton";

describe("PageButton", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<PageButton/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with extra", () => {
        const tree = renderer
            .create(<PageButton
                size='24'
                key={ 1 }
                caption={ 1 }
                onClick={ jest.fn() }
                fill='light'
                color="sun"
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
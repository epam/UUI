import * as React from "react";
import renderer from "react-test-renderer";
import {Panel} from "../Panel";

describe("Panel", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<Panel/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with props", () => {
        const tree = renderer
            .create(<Panel
                shadow
                margin='24'
                background='night50'
                onClick={ jest.fn() }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
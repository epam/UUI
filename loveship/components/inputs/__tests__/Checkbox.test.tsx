import React from "react";
import renderer from "react-test-renderer";
import {Checkbox} from "../Checkbox";

describe("Checkbox", () => {
    const value = true;
    const onChange = jest.fn();

    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<Checkbox value={ value } onValueChange={ onChange }/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with new props", () => {
        const tree = renderer
            .create(<Checkbox
                value={ value }
                onValueChange={ onChange }
                size={ "12" }
                theme={ "dark" }
                color='sun'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
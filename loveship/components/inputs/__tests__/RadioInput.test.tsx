import React from "react";
import renderer from "react-test-renderer";
import {RadioInput} from "../RadioInput";

describe("RadioInput", () => {
    const value = true;
    const onChange = jest.fn();

    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<RadioInput value={ value } onValueChange={ onChange }/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with new props", () => {
        const tree = renderer
            .create(<RadioInput
                value={ value }
                onValueChange={ onChange }
                label="open"
                size="12"
                color={ "sun" as any }
                theme="dark"
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
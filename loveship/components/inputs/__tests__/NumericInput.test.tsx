import React from "react";
import renderer from "react-test-renderer";
import {NumericInput} from "../NumericInput";

describe("NumericInput", () => {
    const onChange = jest.fn();

    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<NumericInput
                min={ 1 }
                max={ 10 }
                value={ 5 }
                onValueChange={ onChange }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with new props", () => {
        const tree = renderer
            .create(<NumericInput
                min={ 1 }
                max={ 10 }
                value={ 5 }
                onValueChange={ onChange }
                size="24"
                mode="cell"
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
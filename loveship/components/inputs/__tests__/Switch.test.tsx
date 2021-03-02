import React from "react";
import renderer from "react-test-renderer";
import {Switch} from "../Switch";

describe("Switch", () => {
    const value = false;
    const onValueChange = jest.fn();

    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<Switch value={ value } onValueChange={ onValueChange }/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with new props", () => {
        const tree = renderer
            .create(<Switch
                value={ value }
                onValueChange={ onValueChange }
                label='Open'
                size='12'
                theme='dark'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
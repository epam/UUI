import React from "react";
import renderer from "react-test-renderer";
import {TimePicker} from "../TimePicker";

jest.mock("react-dom", () => ({
    findDOMNode: jest.fn(),
}));

describe("TimePicker", () => {
    const value = {
        hours: 1,
        minutes: 1,
    };
    const onChange = jest.fn();

    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<TimePicker value={ value } onValueChange={ onChange }/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with extra props", () => {
        const tree = renderer
            .create(<TimePicker
                value={ value }
                onValueChange={ onChange }
                format={ 24 }
                minutesStep={ 5 }
                size='36'
                isDisabled
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
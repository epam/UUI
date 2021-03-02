import React from "react";
import renderer from "react-test-renderer";
import {Rating} from "../Rating";

jest.mock("react-dom", () => ({
    findDOMNode: jest.fn(),
}));

describe("Rating", () => {
    const value = 2;
    const onChange = jest.fn();

    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<Rating value={ value } onValueChange={ onChange }/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });


    it("should be rendered correctly with props", () => {
        const tree = renderer
            .create(<Rating
                value={ value }
                onValueChange={ onChange }
                step={ 1 }
                from={ 1 }
                to={ 4 }
                size={ 24 }
                color="sky"
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
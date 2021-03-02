import React from "react";
import renderer from "react-test-renderer";
import {TextArea} from "../TextArea";

describe("TextArea", () => {
    const value = "test";
    const onChange = jest.fn();

    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<TextArea value={ value } onValueChange={ onChange }/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with extra props", () => {
        const tree = renderer
            .create(<TextArea
                value={ value }
                onValueChange={ onChange }
                placeholder='Type here'
                maxLength={ 200 }
                rows={ 4 }
                size='60'
                fontSize='14'
                lineHeight='30'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
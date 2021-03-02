import React from "react";
import renderer from "react-test-renderer";
import {TextInput} from "../TextInput";
import * as acceptIcon from "../../icons/accept-12.svg";

describe("TextInput", () => {
    const value = "test";
    const onChange = jest.fn();

    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<TextInput value={ value } onValueChange={ onChange }/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with extra props", () => {
        const tree = renderer
            .create(<TextInput
                value={ value }
                onValueChange={ onChange }
                onAccept={ jest.fn() }
                onCancel={ jest.fn() }
                icon={ acceptIcon }
                iconPosition='right'
                isDropdown
                isOpen
                size='60'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
import React from "react";
import renderer from "react-test-renderer";
import {DropdownContainer} from "../DropdownContainer";
import {Button} from "../../buttons";

describe("DropdownContainer", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<DropdownContainer><Button/></DropdownContainer>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with extra props", () => {
        const tree = renderer
            .create(<DropdownContainer color="night700" width={ 200 } height={ 300 }>
                <Button/>
            </DropdownContainer>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
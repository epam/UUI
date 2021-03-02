import React from "react";
import renderer from "react-test-renderer";
import {Paginator} from "../Paginator";

describe("Paginator", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<Paginator size={ "24" }
                               value={ 1 }
                               onValueChange={ jest.fn() }
                               totalPages={ 10 }/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
import React from "react";
import renderer from "react-test-renderer";
import {MultiSwitch} from "../MultiSwitch";

describe("MultiSwitch", () => {
    const items = [{id: 1, caption: "On"}, {id: 2, caption: "Off"}];
    
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<MultiSwitch
                value={ 1 }
                onValueChange={ jest.fn() }
                items={ items }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
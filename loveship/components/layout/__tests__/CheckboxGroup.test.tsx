import React from "react";
import renderer from "react-test-renderer";
import {CheckboxGroup} from "../CheckboxGroup";

describe("CheckboxGroup", () => {
    const items = [{id: 1, name: "test1"}, {id: 2, name: "test2"}];
    
    it("should render with default props", () => {
        const tree = renderer
            .create(<CheckboxGroup
                items={ items }
                value={ [1] }
                onValueChange={ jest.fn() }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with extra props', () => {
        const tree = renderer
            .create(<CheckboxGroup
                value={ [2] }
                onValueChange={ jest.fn() }
                items={ items }
                direction='horizontal'
                isDisabled
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
import React from "react";
import renderer from "react-test-renderer";
import {PickerListItem} from "../PickerListItem";

describe("PickerListItem", () => {
    const id = "1";
    const rowKey = "2";
    const index = 3;
    const getName = jest.fn();

    it("should render with default props", () => {
        const tree = renderer
            .create(<PickerListItem id={ id }
                                    rowKey={ rowKey }
                                    index={ index }
                                    getName={ getName }/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should render with all new props", () => {
        const tree = renderer
            .create(<PickerListItem id={ id }
                                    rowKey={ rowKey }
                                    index={ index }
                                    getName={ getName }
                                    theme='light'/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
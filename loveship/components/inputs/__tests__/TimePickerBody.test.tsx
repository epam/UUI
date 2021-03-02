import React from "react";
import renderer from "react-test-renderer";
import {TimePickerBody} from "../TimePickerBody";
import * as acceptIcon from "../../icons/accept-12.svg";

jest.mock("moment", () => () => ({format: () => "2020–12–09T01:02:03+00:00"}));

describe("TimePickerBody", () => {
    const value = null as any;
    const onValueChange = jest.fn();

    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<TimePickerBody value={ value } onValueChange children={ onValueChange }/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with extra props", () => {
        const tree = renderer
            .create(<TimePickerBody
                value={ value }
                onValueChange={ onValueChange }
                format={ 12 }
                minutesStep={ 5 }
                addIcon={ acceptIcon }
                subtractIcon={ acceptIcon }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
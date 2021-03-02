import * as React from "react";
import renderer from "react-test-renderer";
import {FlexRow} from "../FlexRow";

describe("FlexRow", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<FlexRow/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with props", () => {
        const tree = renderer
            .create(<FlexRow
                size='24'
                background='night100'
                topShadow
                borderBottom='night300'
                padding='18'
                vPadding='24'
                spacing='6'
                alignItems='bottom'
                type='panel'
                margin='24'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
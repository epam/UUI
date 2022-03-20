import * as React from "react";
import renderer from "react-test-renderer";
import {FlexSpacer} from "../FlexSpacer";

describe("FlexSpacer", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<FlexSpacer/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with props", () => {
        const tree = renderer
            .create(<FlexSpacer
                estimatedWidth={ 100 }
                priority={ 3 }
                showInBurgerMenu
                collapseToMore
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
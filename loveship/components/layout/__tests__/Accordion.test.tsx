import React from "react";
import renderer from "react-test-renderer";
import {Accordion} from "../Accordion";
import * as acceptIcon from "../../icons/accept-12.svg";

describe("Accordion", () => {
    it("should be rendered correctly", () => {
        const tree = renderer
            .create(<Accordion title="test" />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should be rendered correctly with extra props", () => {
        const tree = renderer
            .create(<Accordion
                title="test"
                mode="inline"
                dropdownIcon={ acceptIcon }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
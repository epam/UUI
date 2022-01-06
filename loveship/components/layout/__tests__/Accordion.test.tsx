import React from "react";
import renderer from "react-test-renderer";
import {Accordion} from "../Accordion";
import { ReactComponent as AcceptIcon } from "../../icons/accept-12.svg";

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
                dropdownIcon={ AcceptIcon }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
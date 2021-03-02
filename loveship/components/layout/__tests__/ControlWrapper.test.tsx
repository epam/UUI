import React from "react";
import renderer from "react-test-renderer";
import {ControlWrapper} from "../ControlWrapper";
import {Button} from "../../buttons";

describe('ControlWrapper', () => {
    it('should rendered correctly', () => {
        const tree = renderer
            .create(<ControlWrapper size='36'><Button caption='On'/><Button caption='Off' color='sun'/></ControlWrapper>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
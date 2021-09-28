import React from "react";
import renderer from "react-test-renderer";
import * as calendarIcon from '../../../icons/calendar-18.svg';
import { VerticalTabButton } from "../VerticalTabButton";

describe("VerticalTabButton", () => {
    it('should be rendered correctly', () => {

        const tree = renderer
            .create(<VerticalTabButton />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', () => {

        const tree = renderer
            .create(<VerticalTabButton
                onClick={ jest.fn }
                icon={ calendarIcon }
                isDisabled={ false }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
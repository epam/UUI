import React from "react";
import renderer from "react-test-renderer";
import dayjs from 'dayjs';
import {Calendar} from "../Calendar";

describe('Calendar', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<Calendar
                value={ dayjs('2020-09-03') }
                onValueChange={ jest.fn() }
                displayedDate={ dayjs('2020-09-03') }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
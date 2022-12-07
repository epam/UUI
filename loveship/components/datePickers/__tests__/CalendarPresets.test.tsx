import React from "react";
import renderer from "react-test-renderer";
import {rangeDatePickerPresets} from "@epam/uui-components";
import {CalendarPresets} from "../CalendarPresets";

describe('CalendarPresets', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<CalendarPresets
                presets={ rangeDatePickerPresets }
                onPresetSet={ jest.fn() }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
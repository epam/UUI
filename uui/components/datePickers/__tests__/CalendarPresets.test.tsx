import * as React from 'react';
import { CalendarPresets } from '../CalendarPresets';
import { renderer } from '@epam/uui-test-utils';
import { rangeDatePickerPresets } from '../RangeDatePickerBody';

describe('CalendarPresets', () => {
    it('should be rendered correctly', () => {
        const tree = renderer.create(<CalendarPresets presets={ rangeDatePickerPresets } onPresetSet={ jest.fn } />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

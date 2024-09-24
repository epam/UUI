import * as React from 'react';
import { CalendarPresets } from '../CalendarPresets';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { rangeDatePickerPresets } from '../RangeDatePickerBody';

describe('CalendarPresets', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<CalendarPresets presets={ rangeDatePickerPresets } onPresetSet={ jest.fn } />);
        expect(tree).toMatchSnapshot();
    });
});

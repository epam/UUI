import * as React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/test-utils';
import { DatePickerBody } from '../DatePickerBody';

describe('DataPicker', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<DatePickerBody value={null} setDisplayedDateAndView={jest.fn} setSelectedDate={jest.fn} />);
        expect(tree).toMatchSnapshot();
    });
});

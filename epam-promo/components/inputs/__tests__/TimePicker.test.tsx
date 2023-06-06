import React from 'react';
import { TimePicker } from '../TimePicker';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

describe('TimePicker', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<TimePicker value={ null } onValueChange={ jest.fn } />);

        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <TimePicker value={ { hours: 1, minutes: 5 } } onValueChange={ jest.fn } format={ 24 } minutesStep={ 5 } size="36" isDisabled />,
        );

        expect(tree).toMatchSnapshot();
    });
});

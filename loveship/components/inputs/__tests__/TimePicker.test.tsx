import React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { TimePicker } from '../TimePicker';

describe('TimePicker', () => {
    const value = { hours: 1, minutes: 1 };
    const onChange = jest.fn();

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<TimePicker value={ value } onValueChange={ onChange } />);

        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with extra props', async () => {
        const tree = await renderSnapshotWithContextAsync(<TimePicker value={ value } onValueChange={ onChange } format={ 24 } minutesStep={ 5 } size="36" isDisabled />);

        expect(tree).toMatchSnapshot();
    });
});

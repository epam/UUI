import React from 'react';
import { TimePickerBody } from '../timePicker';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import MockDate from 'mockdate';
import { settings } from '../../../settings';

const arrowIcon = settings.iconButton.icons.dropdownIcon;

beforeEach(() => {
    MockDate.set(new Date('2020-12-09T01:02:03+00:00'));
});

afterEach(() => {
    MockDate.reset();
});

describe('TimePickerBody', () => {
    it('should be rendered with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(<TimePickerBody value={ { hours: 12, minutes: 30 } } onValueChange={ jest.fn } />);

        expect(tree).toMatchSnapshot();
    });

    it('should be rendered with maximum props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <TimePickerBody
                value={ { hours: 12, minutes: 30 } }
                onValueChange={ jest.fn }
                format={ 12 }
                minutesStep={ 5 }
                addIcon={ arrowIcon }
                subtractIcon={ arrowIcon }
            />,
        );

        expect(tree).toMatchSnapshot();
    });
});

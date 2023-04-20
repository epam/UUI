import React from 'react';
import { TimePickerBody } from '../TimePickerBody';
import MockDate from 'mockdate';
import { renderSnapshotWithContextAsync } from '@epam/test-utils';
import { systemIcons } from '../../icons/icons';

const acceptIcon = systemIcons[18].accept;

beforeEach(() => {
    MockDate.set(new Date('2020-12-09T01:02:03+00:00'));
});

afterEach(() => {
    MockDate.reset();
});

describe('TimePickerBody', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<TimePickerBody value={ { hours: 12, minutes: 30 } } onValueChange={ jest.fn } />);

        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with extra props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <TimePickerBody
                value={ { hours: 12, minutes: 30 } }
                onValueChange={ jest.fn }
                format={ 12 }
                minutesStep={ 5 }
                addIcon={ acceptIcon }
                subtractIcon={ acceptIcon }
            />,
        );

        expect(tree).toMatchSnapshot();
    });
});

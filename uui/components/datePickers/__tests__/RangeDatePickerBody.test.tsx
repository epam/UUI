import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { RangeDatePickerValue } from '@epam/uui-core';
import { uuiDaySelection } from '@epam/uui-components';
import {
    RangeDatePickerBody, RangeDatePickerBodyProps, RangeDatePickerBodyValue, rangeDatePickerPresets,
} from '../RangeDatePickerBody';
import {
    act, fireEvent, renderSnapshotWithContextAsync, screen, setupComponentForTest, within,
} from '@epam/uui-test-utils';

type RangeBodyProps = RangeDatePickerBodyProps<RangeDatePickerValue | null>;

type RangePickerSetupProps =
    Pick<RangeDatePickerBodyValue<RangeDatePickerValue | null>, 'selectedDate' | 'inFocus'> &
    Pick<RangeBodyProps, 'presets' | 'filter' | 'isHoliday'>;

function parentElemContainsClasses(elem: HTMLElement, classesArr: string[]) {
    // @ts-ignore
    const actualList = [...elem.parentElement.classList];
    return classesArr.every((c: string) => actualList.indexOf(c) !== -1);
}

async function setupRangePickerBody(params: RangePickerSetupProps) {
    const {
        selectedDate, inFocus, presets, filter, isHoliday,
    } = params;

    const _value: RangeDatePickerBodyValue<RangeDatePickerValue | null> = {
        selectedDate,
        inFocus,
    };

    const { result, mocks } = await setupComponentForTest<RangeBodyProps>(
        (context) => {
            return {
                value: _value,
                onValueChange: jest.fn().mockImplementation((newValue) => context.current?.setProperty('value', newValue)),
                presets,
                filter,
                isHoliday,
            };
        },
        (props) => (<RangeDatePickerBody { ...props } />),
    );

    const [leftHeader, rightHeader] = screen.queryAllByRole('banner');

    const [, leftTitle] = within(leftHeader).queryAllByRole('button');
    const [, rightTitle] = within(rightHeader).queryAllByRole('button');

    return {
        result,
        dom: {
            leftTitle,
            rightTitle,
        },
        mocks,
    };
}

describe('RangeDatePickerBody', () => {
    it('should be rendered correctly', async () => {
        const value: RangeDatePickerBodyValue<RangeDatePickerValue> = {
            selectedDate: {
                from: '2019-10-12',
                to: '2019-10-18',
            },
            inFocus: 'from',
        };
        const tree = await renderSnapshotWithContextAsync(
            <RangeDatePickerBody
                value={ value }
                onValueChange={ jest.fn }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should not clear "to" when user selects "form" earlier than "to"', async () => {
        const { mocks } = await setupRangePickerBody({
            inFocus: 'from',
            selectedDate: {
                from: '2019-10-12',
                to: '2019-10-17',
            },
        });

        const [oct13] = screen.getAllByText('13');
        fireEvent.click(oct13);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith({
            inFocus: 'to',
            selectedDate: {
                from: '2019-10-13',
                to: '2019-10-17',
            },
        });

        const [_oct13] = screen.getAllByText('13');
        fireEvent.click(_oct13);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith({
            inFocus: 'from',
            selectedDate: {
                from: '2019-10-13',
                to: '2019-10-13',
            },
        });
    });

    it('should clear "to" when user selects "from" later than "to"', async () => {
        const { mocks } = await setupRangePickerBody({
            inFocus: 'from',
            selectedDate: {
                from: '2019-10-12',
                to: '2019-10-17',
            },
        });

        const [oct18] = screen.getAllByText('18');
        fireEvent.click(oct18);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith({
            inFocus: 'to',
            selectedDate: {
                from: '2019-10-18',
                to: null,
            },
        });
    });

    it('should not clear "from" when user selects "to" bigger than "from"', async () => {
        const { mocks } = await setupRangePickerBody({
            inFocus: 'to',
            selectedDate: {
                from: '2019-10-12',
                to: '2019-10-17',
            },
        });

        const [oct16] = screen.getAllByText('16');
        fireEvent.click(oct16);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith({
            inFocus: 'from',
            selectedDate: {
                from: '2019-10-12',
                to: '2019-10-16',
            },
        });
    });

    it('should clear "to" when user selects it earlier than "from"', async () => {
        const { mocks } = await setupRangePickerBody({
            inFocus: 'to',
            selectedDate: {
                from: '2019-10-12',
                to: '2019-10-17',
            },
        });

        const [oct11] = screen.getAllByText('11');
        fireEvent.click(oct11);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith({
            inFocus: 'to',
            selectedDate: {
                from: '2019-10-11',
                to: null,
            },
        });
    });

    it('should change view by click on title', async () => {
        const { dom } = await setupRangePickerBody({
            inFocus: 'from',
            selectedDate: {
                from: '2019-10-12',
                to: '2019-10-17',
            },
        });
        expect(dom.leftTitle.textContent).toEqual('October 2019');
        expect(dom.rightTitle.textContent).toEqual('November 2019');

        fireEvent.click(dom.leftTitle);
        expect(screen.getByText('2019')).toBeInTheDocument();
        expect(dom.leftTitle.textContent).toEqual(' 2019');

        fireEvent.click(dom.leftTitle);
        expect(screen.getByText('October 2019')).toBeTruthy();
        expect(dom.leftTitle.textContent).toEqual('October 2019');
    });

    it('should have special class names for selected days', async () => {
        const useCase1 = await setupRangePickerBody({
            inFocus: 'from',
            selectedDate: null,
        });
        expect(useCase1.result.container.querySelectorAll('.uui-calendar-selected-day').length).toBe(0);
        useCase1.result.unmount();

        const useCase2 = await setupRangePickerBody({
            inFocus: 'from',
            selectedDate: {
                from: '2019-10-12',
                to: '2019-10-14',
            },
        });
        expect(useCase2.result.container.querySelectorAll('.uui-calendar-selected-day').length).toBe(2);

        const [oct12] = useCase2.result.queryAllByText('12');
        const [oct13] = useCase2.result.queryAllByText('13');
        const [oct14] = useCase2.result.queryAllByText('14');

        expect(parentElemContainsClasses(oct12, ['uui-range-datepicker-first-day-in-range-wrapper', uuiDaySelection.selectedDay])).toBeTruthy();
        expect(parentElemContainsClasses(oct13, ['uui-range-datepicker-in-range'])).toBeTruthy();
        expect(parentElemContainsClasses(oct14, ['uui-range-datepicker-last-day-in-range-wrapper', uuiDaySelection.selectedDay])).toBeTruthy();
    });

    it('should work with presets', async () => {
        const { result } = await setupRangePickerBody({
            inFocus: 'from',
            selectedDate: null,
            presets: rangeDatePickerPresets,
        });
        expect(result.container.querySelectorAll('.uui-calendar-selected-day').length).toBe(0);

        const today = screen.getByText('Today');
        act(() => {
            today.click();
        });

        const [selectedDay] = screen.queryAllByText(dayjs().date());
        expect(parentElemContainsClasses(selectedDay, [
            'uui-range-datepicker-first-day-in-range-wrapper',
            'uui-range-datepicker-last-day-in-range-wrapper',
            uuiDaySelection.selectedDay,
        ])).toBeTruthy();
    });

    it('should start selection from start date', async () => {
        const { mocks } = await setupRangePickerBody({
            inFocus: 'from',
            selectedDate: null,
        });

        const [oct13] = screen.getAllByText('13');
        fireEvent.click(oct13);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith({
            inFocus: 'to',
            selectedDate: {
                from: expect.stringContaining('13'),
                to: null,
            },
        });
    });

    it('should start selection from end date', async () => {
        const { mocks } = await setupRangePickerBody({
            inFocus: 'to',
            selectedDate: null,
        });

        const [oct17] = screen.getAllByText('17');
        fireEvent.click(oct17);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith({
            inFocus: 'from',
            selectedDate: {
                from: null,
                to: expect.stringContaining('17'),
            },
        });
    });

    it('should not change date range if there is filter', async () => {
        const { mocks } = await setupRangePickerBody({
            inFocus: 'to',
            selectedDate: {
                from: '2019-10-12',
                to: '2019-10-14',
            },
            filter: (day: Dayjs) => {
                return day.valueOf() <= dayjs('2019-10-22').subtract(0, 'day').valueOf();
            },
        });

        const [oct25] = screen.getAllByText('25');
        fireEvent.click(oct25);

        expect(mocks.onValueChange).not.toHaveBeenCalled();
    });

    it('should mark weekends', async () => {
        await setupRangePickerBody({
            inFocus: 'to',
            selectedDate: {
                from: '2019-10-12',
                to: '2019-10-14',
            },
        });

        // random day
        const [oct11] = screen.getAllByText('11');
        expect(parentElemContainsClasses(oct11, ['uui-calendar-day-holiday'])).toBeFalsy();

        // weekends
        const [oct12] = screen.getAllByText('12');
        expect(parentElemContainsClasses(oct12, ['uui-calendar-day-holiday'])).toBeTruthy();
        const [oct13] = screen.getAllByText('13');
        expect(parentElemContainsClasses(oct13, ['uui-calendar-day-holiday'])).toBeTruthy();
    });

    it('should mark holidays', async () => {
        await setupRangePickerBody({
            inFocus: 'to',
            selectedDate: {
                from: '2019-10-12',
                to: '2019-10-14',
            },
            isHoliday: (day?: Dayjs) => {
                return day?.date() === 11;
            },
        });

        // random day
        const [oct11] = screen.getAllByText('11');
        expect(parentElemContainsClasses(oct11, ['uui-calendar-day-holiday'])).toBeTruthy();

        // weekends
        const [oct12] = screen.getAllByText('12');
        expect(parentElemContainsClasses(oct12, ['uui-calendar-day-holiday'])).toBeFalsy();
        const [oct13] = screen.getAllByText('13');
        expect(parentElemContainsClasses(oct13, ['uui-calendar-day-holiday'])).toBeFalsy();
    });
});

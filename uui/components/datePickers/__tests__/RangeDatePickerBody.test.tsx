import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { RangePickerBodyValue, uuiDaySelection, type ViewType } from '@epam/uui-components';
import { RangeDatePickerBody, RangeDatePickerBodyProps, rangeDatePickerPresets, RangeDatePickerValue } from '../RangeDatePickerBody';
import { act, fireEvent, renderSnapshotWithContextAsync, screen, setupComponentForTest, within } from '@epam/uui-test-utils';

type RangePickerSetupProps = {
    selectedDate: RangePickerBodyValue<RangeDatePickerValue>['selectedDate'];
    activePart: RangePickerBodyValue<RangeDatePickerValue>['activePart'];
    presets?: RangeDatePickerBodyProps<RangeDatePickerValue>['presets'];
    filter?: RangeDatePickerBodyProps<RangeDatePickerValue>['filter'];
    isHoliday?: RangeDatePickerBodyProps<RangeDatePickerValue>['isHoliday'];
};

function parentElemContainsClasses(elem: HTMLElement, classesArr: string[]) {
    // @ts-ignore
    const actualList = [...elem.parentElement.classList];
    return classesArr.every((c: string) => actualList.indexOf(c) !== -1);
}

async function setupRangePickerBody(params: RangePickerSetupProps) {
    const {
        selectedDate, activePart, presets, filter, isHoliday,
    } = params;

    const { result, mocks } = await setupComponentForTest<RangeDatePickerBodyProps<RangeDatePickerValue>>(
        (context) => {
            return {
                value: {
                    view: 'DAY_SELECTION',
                    selectedDate,
                    month: dayjs('2019-10-12').startOf('day'),
                    activePart: activePart,
                },
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
        const value: RangePickerBodyValue<RangeDatePickerValue> = {
            view: 'DAY_SELECTION',
            selectedDate: {
                from: null,
                to: null,
            },
            month: dayjs('2020-09-03'),
            activePart: 'from',
        };
        const tree = await renderSnapshotWithContextAsync(
            <RangeDatePickerBody
                value={ value }
                onValueChange={ jest.fn }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('[focusPart:from] should clear "To" only when user selects "From" which is bigger than "To"', async () => {
        const { mocks } = await setupRangePickerBody({
            activePart: 'from',
            selectedDate: {
                from: '2019-10-12',
                to: '2019-10-17',
            },
        });

        // "To" is not cleared when user selects "From" earlier than "To"
        // case-1
        const [oct13] = screen.getAllByText('13');
        fireEvent.click(oct13);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith({
            activePart: 'from',
            month: expect.anything(),
            view: expect.anything(),
            selectedDate: {
                from: '2019-10-13',
                to: '2019-10-17',
            },
        });
        // case-2
        const [oct17] = screen.getAllByText('17');
        fireEvent.click(oct17);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith({
            activePart: 'from',
            month: expect.anything(),
            view: expect.anything(),
            selectedDate: {
                from: '2019-10-17',
                to: '2019-10-17',
            },
        });

        // "To" is cleared when user tries to select "From" later than "To"
        const [oct18] = screen.getAllByText('18');
        fireEvent.click(oct18);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith({
            activePart: 'from',
            month: expect.anything(),
            view: expect.anything(),
            selectedDate: {
                from: '2019-10-18',
                to: null,
            },
        });
    });

    it('[focusPart:to] should select "From" when user selects "To" which is less than "From"', async () => {
        const { mocks } = await setupRangePickerBody({
            activePart: 'to',
            selectedDate: {
                from: '2019-10-12',
                to: '2019-10-17',
            },
        });

        // "From" is not cleared user selects "To" equal or bigger than "From"
        // case-1
        const [oct16] = screen.getAllByText('16');
        fireEvent.click(oct16);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith({
            activePart: 'to',
            month: expect.anything(),
            view: expect.anything(),
            selectedDate: {
                from: '2019-10-12',
                to: '2019-10-16',
            },
        });
        // case-2
        const [oct12] = screen.getAllByText('12');
        fireEvent.click(oct12);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith({
            activePart: 'to',
            month: expect.anything(),
            view: expect.anything(),
            selectedDate: {
                from: '2019-10-12',
                to: '2019-10-12',
            },
        });

        // "From" is selected when user selects "To" less than "From" (This is different from how focusPart: from works)
        const [oct11] = screen.getAllByText('11');
        fireEvent.click(oct11);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith({
            activePart: 'to',
            month: expect.anything(),
            view: expect.anything(),
            selectedDate: {
                from: '2019-10-11',
                to: null,
            },
        });
    });

    it('should change view by click on title', async () => {
        const { dom } = await setupRangePickerBody({
            activePart: 'from',
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
            activePart: 'from',
            selectedDate: null,
        });
        expect(useCase1.result.container.querySelectorAll('.uui-calendar-selected-day').length).toBe(0);
        useCase1.result.unmount();

        const useCase2 = await setupRangePickerBody({
            activePart: 'from',
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
            activePart: 'from',
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
            activePart: 'from',
            selectedDate: null,
        });

        const [oct13] = screen.getAllByText('13');
        fireEvent.click(oct13);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith({
            activePart: 'from',
            month: expect.anything(),
            view: expect.anything(),
            selectedDate: {
                from: '2019-10-13',
                to: null,
            },
        });
    });

    it('should start selection from end date', async () => {
        const { mocks } = await setupRangePickerBody({
            activePart: 'to',
            selectedDate: null,
        });

        const [oct17] = screen.getAllByText('17');
        fireEvent.click(oct17);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith({
            activePart: 'to',
            month: expect.anything(),
            view: expect.anything(),
            selectedDate: {
                from: null,
                to: '2019-10-17',
            },
        });
    });

    it('should not change date range if there is filter', async () => {
        const { mocks } = await setupRangePickerBody({
            activePart: 'to',
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
            activePart: 'to',
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
            activePart: 'to',
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

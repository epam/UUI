import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { uuiDaySelection, type ViewType } from '@epam/uui-components';
import { RangeDatePickerBody, RangeDatePickerBodyProps, rangeDatePickerPresets, RangeDatePickerValue, uuiRangeDatePickerBody } from '../RangeDatePickerBody';
import { act, fireEvent, renderer, screen, setupComponentForTest, within } from '@epam/uui-test-utils';

type RangePickerSetupProps = {
    selectedDate: RangeDatePickerBodyProps<RangeDatePickerValue>['value']['selectedDate'];
    focusPart: RangeDatePickerBodyProps<RangeDatePickerValue>['focusPart'];
    presets?: RangeDatePickerBodyProps<RangeDatePickerValue>['presets'];
    filter?: RangeDatePickerBodyProps<RangeDatePickerValue>['filter'];
};

function parentElemContainsClasses(elem: HTMLElement, classesArr: string[]) {
    // @ts-ignore
    const actualList = [...elem.parentElement.classList];
    return classesArr.every((c: string) => actualList.indexOf(c) !== -1);
}

async function setupRangePickerBody(params: RangePickerSetupProps) {
    const { selectedDate, focusPart, presets, filter } = params;

    const { result, mocks } = await setupComponentForTest<RangeDatePickerBodyProps<any>>(
        (context) => {
            return {
                value: {
                    view: 'DAY_SELECTION' as any,
                    selectedDate,
                    displayedDate: dayjs('2019-10-12').startOf('day'),
                },
                focusPart,
                presets,
                filter,
                changeIsOpen: jest.fn(),
                onValueChange: jest.fn().mockImplementation((newValue) => context.current?.setProperty('value', newValue)),
            };
        },
        (props) => (<RangeDatePickerBody { ...props } />),
    );

    const [leftHeader] = screen.queryAllByRole('banner');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [back, title] = within(leftHeader).queryAllByRole('button');

    return {
        result,
        dom: { title },
        mocks,
    };
}

describe('RangeDatePickerBody', () => {
    it('should be rendered correctly', () => {
        const displayedDate = dayjs('2020-09-03');
        const value = {
            view: 'DAY_SELECTION' as ViewType,
            selectedDate: {
                from: null,
                to: null,
            },
            displayedDate,
        };
        const tree = renderer.create(
            <RangeDatePickerBody
                value={ value }
                focusPart="from"
                onValueChange={ jest.fn }
            />,
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('[focusPart:from] should clear "To" only when user selects "From" which is bigger than "To"', async () => {
        const { mocks } = await setupRangePickerBody({
            focusPart: 'from',
            selectedDate: { from: '2019-10-12', to: '2019-10-17' },
        });

        // "To" is not cleared when user selects "From" not bigger than "To"
        // case-1
        const [oct13] = screen.getAllByText('13');
        fireEvent.click(oct13);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith({
            displayedDate: expect.anything(),
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
            displayedDate: expect.anything(),
            view: expect.anything(),
            selectedDate: {
                from: '2019-10-17',
                to: '2019-10-17',
            },
        });

        // "To" is cleared when user tries to select "From" bigger than "To"
        const [oct18] = screen.getAllByText('18');
        fireEvent.click(oct18);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith({
            displayedDate: expect.anything(),
            view: expect.anything(),
            selectedDate: {
                from: '2019-10-18',
                to: null,
            },
        });
    });

    it('[focusPart:to] should select "From" when user selects "To" which is less than "From"', async () => {
        const { mocks } = await setupRangePickerBody({
            focusPart: 'to',
            selectedDate: { from: '2019-10-12', to: '2019-10-17' },
        });

        // "From" is not cleared user selects "To" equal or bigger than "From"
        // case-1
        const [oct16] = screen.getAllByText('16');
        fireEvent.click(oct16);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith({
            displayedDate: expect.anything(),
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
            displayedDate: expect.anything(),
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
            displayedDate: expect.anything(),
            view: expect.anything(),
            selectedDate: {
                from: '2019-10-11',
                to: null,
            },
        });
    });

    it('should change view by click on title', async () => {
        const { dom } = await setupRangePickerBody({
            focusPart: 'from',
            selectedDate: { from: '2019-10-12', to: '2019-10-17' },
        });
        expect(dom.title.textContent).toEqual('October 2019');

        fireEvent.click(dom.title);
        expect(screen.getByText('2019')).toBeInTheDocument();
        expect(screen.getByText('Oct').classList.contains('uui-monthselection-current-month')).toBeTruthy();
        expect(dom.title.textContent).toEqual(' 2019');

        fireEvent.click(dom.title);
        expect(screen.getByText('October 2019')).toBeTruthy();
        expect(screen.getByText('2019').classList.contains('uui-yearselection-current-year')).toBeTruthy();
        expect(dom.title.textContent).toEqual('October 2019');
    });

    it('should have special class names for selected days', async () => {
        const useCase1 = await setupRangePickerBody({
            focusPart: 'from',
            selectedDate: null,
        });
        expect(useCase1.result.container.querySelectorAll('.uui-calendar-selected-day').length).toBe(0);
        useCase1.result.unmount();

        const useCase2 = await setupRangePickerBody({
            focusPart: 'from',
            selectedDate: { from: '2019-10-12', to: '2019-10-14' },
        });
        expect(useCase2.result.container.querySelectorAll('.uui-calendar-selected-day').length).toBe(2);

        const [oct12] = useCase2.result.queryAllByText('12');
        const [oct13] = useCase2.result.queryAllByText('13');
        const [oct14] = useCase2.result.queryAllByText('14');

        expect(parentElemContainsClasses(oct12, [uuiRangeDatePickerBody.firstDayInRangeWrapper, uuiDaySelection.selectedDay])).toBeTruthy();
        expect(parentElemContainsClasses(oct13, [uuiRangeDatePickerBody.inRange])).toBeTruthy();
        expect(parentElemContainsClasses(oct14, [uuiRangeDatePickerBody.lastDayInRangeWrapper, uuiDaySelection.selectedDay])).toBeTruthy();
    });

    it('should work with presets', async () => {
        const { result } = await setupRangePickerBody({
            focusPart: 'from',
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
            uuiRangeDatePickerBody.firstDayInRangeWrapper,
            uuiRangeDatePickerBody.lastDayInRangeWrapper,
            uuiDaySelection.selectedDay,
        ])).toBeTruthy();
    });

    it('should start selection from start date', async () => {
        const { mocks } = await setupRangePickerBody({
            focusPart: 'from',
            selectedDate: null,
        });

        const [oct13] = screen.getAllByText('13');
        fireEvent.click(oct13);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith({
            displayedDate: expect.anything(),
            view: expect.anything(),
            selectedDate: {
                from: '2019-10-13',
                to: null,
            },
        });
    });

    it('should start selection from end date', async () => {
        const { mocks } = await setupRangePickerBody({
            focusPart: 'to',
            selectedDate: null,
        });

        const [oct17] = screen.getAllByText('17');
        fireEvent.click(oct17);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith({
            displayedDate: expect.anything(),
            view: expect.anything(),
            selectedDate: {
                from: null,
                to: '2019-10-17',
            },
        });
    });

    it('should not change date range if there is filter', async () => {
        const { mocks } = await setupRangePickerBody({
            focusPart: 'to',
            selectedDate: { from: '2019-10-12', to: '2019-10-14' },
            filter: (day: Dayjs) => {
                return day.valueOf() <= dayjs('2019-10-22').subtract(0, 'day').valueOf();
            },
        });

        const [oct25] = screen.getAllByText('25');
        fireEvent.click(oct25);

        expect(mocks.onValueChange).not.toHaveBeenCalled();
    });
});

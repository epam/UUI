import * as React from 'react';
// @ts-ignore
import dayjs from 'dayjs';
import type { ViewType } from '@epam/uui-components';
import { RangeDatePickerBody, RangeDatePickerBodyProps, RangeDatePickerValue } from '../RangeDatePickerBody';
import { fireEvent, renderer, screen, setupComponentForTest, within } from '@epam/uui-test-utils';

async function setupRangePickerBody(params: { selectedDate: { from: string; to: string }; focusPart: any }) {
    const { selectedDate, focusPart } = params;

    const { result, mocks } = await setupComponentForTest<RangeDatePickerBodyProps<any>>(
        (context) => {
            return {
                value: {
                    view: 'DAY_SELECTION' as any,
                    selectedDate,
                    displayedDate: dayjs('2019-10-12').startOf('day'),
                },
                focusPart,
                changeIsOpen: jest.fn(),
                onValueChange: jest.fn().mockImplementation((newValue) => context.current.setProperty('value', newValue)),
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

describe('DatePickerBody', () => {
    it('should be rendered correctly', () => {
        const displayedDate = dayjs('2020-09-03');
        const value = {
            view: 'DAY_SELECTION' as ViewType,
            selectedDate: {
                from: null,
                to: null,
            } as RangeDatePickerValue,
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
        expect(dom.title.children[0].innerHTML).toEqual('October 2019');
        fireEvent.click(dom.title);
        expect(screen.getByText('2019')).toBeInTheDocument();
        expect(screen.getByText('Oct').classList.contains('uui-monthselection-current-month')).toBeTruthy();
        fireEvent.click(dom.title);
        expect(screen.getByText('October 2019')).toBeTruthy();
        expect(screen.getByText('2019').classList.contains('uui-yearselection-current-year')).toBeTruthy();
    });

    it('should have special class names for selected days', async () => {
        const useCase1 = await setupRangePickerBody({
            focusPart: 'from',
            selectedDate: { from: null, to: null },
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

        function parentElemContainsClasses(elem: HTMLElement, classesArr: string[]) {
            // @ts-ignore
            const actualList = [...elem.parentElement.classList];
            return classesArr.every((c: string) => actualList.indexOf(c) !== -1);
        }

        expect(parentElemContainsClasses(oct12, ['uui-range-datepicker-first-day-in-range-wrapper', 'uui-calendar-selected-day'])).toBeTruthy();
        expect(parentElemContainsClasses(oct13, ['uui-range-datepicker-in-range'])).toBeTruthy();
        expect(parentElemContainsClasses(oct14, ['uui-range-datepicker-last-day-in-range-wrapper', 'uui-calendar-selected-day'])).toBeTruthy();
    });
});

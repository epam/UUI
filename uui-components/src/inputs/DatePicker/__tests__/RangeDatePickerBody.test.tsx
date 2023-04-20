import * as React from 'react';
import dayjs from 'dayjs';
import { RangeDatePickerBody } from '../RangeDatePickerBody';
import { renderToJsdomWithContextAsync, fireEvent, screen } from '@epam/test-utils';
import { useState } from 'react';

async function setupRangePickerBody(params: { selectedDate: { from: string; to: string }; focusPart: any }) {
    const { selectedDate, focusPart } = params;
    const handleChange = jest.fn();
    const handleChangeIsOpen = jest.fn();
    function TestRangePickerBody(paramsInner: { focusPart: any }) {
        const [value, setValue] = useState(() => {
            return {
                view: 'DAY_SELECTION' as any,
                selectedDate,
                displayedDate: dayjs('2019-10-12').startOf('day'),
            };
        });
        return (
            <RangeDatePickerBody
                value={ value }
                onValueChange={ (newValue) => {
                    setValue(newValue);
                    handleChange(newValue);
                } }
                changeIsOpen={ handleChangeIsOpen }
                focusPart={ paramsInner.focusPart }
            />
        );
    }
    const result = await renderToJsdomWithContextAsync(<TestRangePickerBody focusPart={ focusPart } />);
    const title = document.body.querySelector('.uui-datepickerheader-nav-title');

    return {
        result,
        dom: { title },
        mocks: { handleChange, handleChangeIsOpen },
    };
}

describe('DatePickerBody', () => {
    it('[focusPart:from] should clear "To" only when user selects "From" which is bigger than "To"', async () => {
        const { mocks } = await setupRangePickerBody({
            focusPart: 'from',
            selectedDate: { from: '2019-10-12', to: '2019-10-17' },
        });

        // "To" is not cleared when user selects "From" not bigger than "To"
        // case-1
        const [oct13] = screen.getAllByText('13');
        fireEvent.click(oct13);
        expect(mocks.handleChange).toHaveBeenLastCalledWith({
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
        expect(mocks.handleChange).toHaveBeenLastCalledWith({
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
        expect(mocks.handleChange).toHaveBeenLastCalledWith({
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
        expect(mocks.handleChange).toHaveBeenLastCalledWith({
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
        expect(mocks.handleChange).toHaveBeenLastCalledWith({
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
        expect(mocks.handleChange).toHaveBeenLastCalledWith({
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
        expect(dom.title.innerHTML).toEqual('October 2019');
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
            const actualList = [...elem.parentElement.classList];
            return classesArr.every((c: string) => actualList.indexOf(c) !== -1);
        }

        expect(parentElemContainsClasses(oct12, ['uui-range-datepicker-first-day-in-range-wrapper', 'uui-calendar-selected-day'])).toBeTruthy();
        expect(parentElemContainsClasses(oct13, ['uui-range-datepicker-in-range'])).toBeTruthy();
        expect(parentElemContainsClasses(oct14, ['uui-range-datepicker-last-day-in-range-wrapper', 'uui-calendar-selected-day'])).toBeTruthy();
    });
});

import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import dayjs from 'dayjs';
import { DatePickerHeader } from '../..';

describe('DatePickerHeader', () => {
    let wrapper: ShallowWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;

    afterEach(() => {
        wrapper && wrapper.unmount();
    });

    it('should change date on arrow click', () => {
        let newState: any = {};
        let currentDay = dayjs().startOf('day');
        wrapper = shallow(
            <DatePickerHeader
                value={{
                    view: 'DAY_SELECTION',
                    selectedDate: '',
                    displayedDate: currentDay,
                }}
                onValueChange={(nV: any) => (newState = nV)}
            />,
            {}
        );
        (wrapper.instance() as any).onLeftNavigationArrow();
        expect(newState.displayedDate).toEqual(currentDay.subtract(1, 'month'));
        (wrapper.instance() as any).onRightNavigationArrow();
        (wrapper.instance() as any).onRightNavigationArrow();
        expect(newState.displayedDate).toEqual(currentDay.add(1, 'month'));
    });

    it('should change view on header caption click', () => {
        let state: any = { view: 'DAY_SELECTION' };
        let currentDay = dayjs().startOf('day');
        wrapper = shallow(
            <DatePickerHeader
                value={{
                    view: 'DAY_SELECTION',
                    selectedDate: '',
                    displayedDate: currentDay,
                }}
                onValueChange={(nV: any) => (state = nV)}
            />,
            {}
        );
        (wrapper.instance() as any).onCaptionClick(state.view);
        expect(state.view).toEqual('MONTH_SELECTION');
        (wrapper.instance() as any).onCaptionClick(state.view);
        expect(state.view).toEqual('YEAR_SELECTION');
        (wrapper.instance() as any).onCaptionClick(state.view);
        expect(state.view).toEqual('DAY_SELECTION');
    });
});

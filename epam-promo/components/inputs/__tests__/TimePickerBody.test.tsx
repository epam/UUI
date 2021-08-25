import React from 'react';
import { TimePickerBody } from '../TimePickerBody';
import renderer from 'react-test-renderer';
import MockDate from 'mockdate';
import { systemIcons } from "./../../../icons/icons";
const arrowIcon = systemIcons[30].foldingArrow;

beforeEach(() => {
    MockDate.set(new Date("2020-12-09T01:02:03+00:00"));
});

afterEach(() => {
    MockDate.reset();
});

describe('TimePickerBody', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<TimePickerBody
                value={ { hours: 12, minutes: 30 } }
                onValueChange={ jest.fn }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<TimePickerBody
                value={ { hours: 12, minutes: 30 } }
                onValueChange={ jest.fn }
                format={ 12 }
                minutesStep={ 5 }
                addIcon={ arrowIcon }
                subtractIcon={ arrowIcon }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});



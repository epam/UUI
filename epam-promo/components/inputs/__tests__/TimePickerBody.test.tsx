import React from 'react';
import { TimePickerBody } from '../TimePickerBody';
import renderer from 'react-test-renderer';
import * as arrowIcon from './../../../icons/folding-arrow-18.svg';

describe('TimePickerBody', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<TimePickerBody
                value={ null }
                onValueChange={ jest.fn }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<TimePickerBody
                value={ null }
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



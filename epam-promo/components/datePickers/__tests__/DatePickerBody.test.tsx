import * as React from 'react';
import renderer from 'react-test-renderer';
import { DatePickerBody } from '..';

describe('DataPicker', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<DatePickerBody
                value={ null }
                setDisplayedDateAndView={ (displayedDate, view) => {} }
                setSelectedDate={ newDate => {} }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

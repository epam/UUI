import React from 'react';
import { TimePicker } from '../TimePicker';
import renderer from 'react-test-renderer';

jest.mock('react-dom', () => ({
    findDOMNode: jest.fn(),
}));

describe('TimePicker', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<TimePicker
                value={ null }
                onValueChange={ jest.fn }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        let tree: any;
        tree = renderer
            .create(<TimePicker
                value={ { hours: 1, minutes: 5 } }
                onValueChange={ jest.fn }
                format={ 24 }
                minutesStep={ 5 }
                size='36'
                isDisabled
            />)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });
});



import React from 'react';
import { Alert, ErrorAlert, HintAlert, SuccessAlert, WarningAlert } from '../Alert';
import renderer from 'react-test-renderer';
import * as calendarIcon from '../../../icons/calendar-18.svg';

describe('Alert', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<Alert />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<Alert
                icon={ calendarIcon }
                color='amber'
                actions={ [{
                    name: 'ACTION 1',
                    action: jest.fn,
                }] }
                onClose={ jest.fn }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('WarningAlert', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<WarningAlert />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('SuccessAlert', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<SuccessAlert />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('HintAlert', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<HintAlert />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('ErrorAlert', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<ErrorAlert />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});



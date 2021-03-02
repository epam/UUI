import React from 'react';
import { ClearNotification, ErrorNotification, HintNotification, NotificationCard, SuccessNotification, WarningNotification } from '../NotificationCard';
import renderer from 'react-test-renderer';
import * as calendarIcon from '../../../icons/calendar-18.svg';

describe('NotificationCard', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<NotificationCard
                id={ 1 }
                key='test'
                color='red'
                onClose={ jest.fn }
                onSuccess={ jest.fn }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<NotificationCard
                icon={ calendarIcon }
                id={ 1 }
                key='test'
                color='red'
                onClose={ jest.fn }
                onSuccess={ jest.fn }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('WarningNotification', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<WarningNotification
                id={ 1 }
                key='test'
                onClose={ jest.fn }
                onSuccess={ jest.fn }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('SuccessNotification', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<SuccessNotification
                id={ 1 }
                key='test'
                onClose={ jest.fn }
                onSuccess={ jest.fn }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('HintNotification', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<HintNotification
                id={ 1 }
                key='test'
                onClose={ jest.fn }
                onSuccess={ jest.fn }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('ErrorNotification', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<ErrorNotification
                id={ 1 }
                key='test'
                onClose={ jest.fn }
                onSuccess={ jest.fn }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('ClearNotification', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<ClearNotification
                key='test'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
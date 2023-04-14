import React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/test-utils';
import { ClearNotification, ErrorNotification, HintNotification, NotificationCard, SuccessNotification, WarningNotification } from '../NotificationCard';
import { ReactComponent as CalendarIcon } from '../../../icons/calendar-18.svg';

describe('NotificationCard', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <NotificationCard
                id={ 1 }
                key="test"
                color="error"
                onClose={ jest.fn }
                onSuccess={ jest.fn }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <NotificationCard
                icon={ CalendarIcon }
                id={ 1 }
                key="test"
                color="error"
                onClose={ jest.fn }
                onSuccess={ jest.fn }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});

describe('WarningNotification', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <WarningNotification
                id={ 1 }
                key="test"
                onClose={ jest.fn }
                onSuccess={ jest.fn }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});

describe('SuccessNotification', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <SuccessNotification
                id={ 1 }
                key="test"
                onClose={ jest.fn }
                onSuccess={ jest.fn }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});

describe('HintNotification', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <HintNotification
                id={ 1 }
                key="test"
                onClose={ jest.fn }
                onSuccess={ jest.fn }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});

describe('ErrorNotification', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <ErrorNotification
                id={ 1 }
                key="test"
                onClose={ jest.fn }
                onSuccess={ jest.fn }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});

describe('ClearNotification', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<ClearNotification key="test"/>);
        expect(tree).toMatchSnapshot();
    });
});

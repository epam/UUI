import React from 'react';
import { renderSnapshotWithContextAsync, SvgMock } from '@epam/uui-test-utils';
import {
    ClearNotification, ErrorNotification, HintNotification, NotificationCard, SuccessNotification, WarningNotification,
} from '../NotificationCard';

describe('NotificationCard', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<NotificationCard id={ 1 } key="test" color="error" onClose={ jest.fn } onSuccess={ jest.fn } />);
        expect(tree).toMatchSnapshot();
    });

    it('should render with maximum props', async () => {
        const tree = await renderSnapshotWithContextAsync(<NotificationCard icon={ SvgMock } id={ 1 } key="test" color="error" onClose={ jest.fn } onSuccess={ jest.fn } />);
        expect(tree).toMatchSnapshot();
    });
});

describe('WarningNotification', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<WarningNotification id={ 1 } key="test" onClose={ jest.fn } onSuccess={ jest.fn } />);
        expect(tree).toMatchSnapshot();
    });
});

describe('SuccessNotification', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<SuccessNotification id={ 1 } key="test" onClose={ jest.fn } onSuccess={ jest.fn } />);
        expect(tree).toMatchSnapshot();
    });
});

describe('HintNotification', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<HintNotification id={ 1 } key="test" onClose={ jest.fn } onSuccess={ jest.fn } />);
        expect(tree).toMatchSnapshot();
    });
});

describe('ErrorNotification', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<ErrorNotification id={ 1 } key="test" onClose={ jest.fn } onSuccess={ jest.fn } />);
        expect(tree).toMatchSnapshot();
    });
});

describe('ClearNotification', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<ClearNotification key="test" />);
        expect(tree).toMatchSnapshot();
    });
});

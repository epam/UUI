import React from 'react';
import { renderWithContextAsync } from '@epam/test-utils';
import {
    ClearNotification,
    ErrorNotification,
    HintNotification,
    NotificationCard,
    SuccessNotification,
    WarningNotification,
} from '../NotificationCard';
import { ReactComponent as AcceptIcon } from '../../icons/accept-12.svg';

describe('NotificationCard', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderWithContextAsync(
            <NotificationCard icon={AcceptIcon} id={1} key="test" color="sun" onClose={jest.fn()} onSuccess={jest.fn()} />
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with icon', async () => {
        const tree = await renderWithContextAsync(
            <NotificationCard icon={AcceptIcon} id={1} key="test" color="sun" onClose={jest.fn()} onSuccess={jest.fn()} />
        );
        expect(tree).toMatchSnapshot();
    });
});

describe('WarningNotification', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderWithContextAsync(<WarningNotification id={1} key="test" onClose={jest.fn()} onSuccess={jest.fn()} />);
        expect(tree).toMatchSnapshot();
    });
});

describe('SuccessNotification', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderWithContextAsync(<SuccessNotification id={1} key="test" onClose={jest.fn()} onSuccess={jest.fn()} />);
        expect(tree).toMatchSnapshot();
    });
});

describe('HintNotification', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderWithContextAsync(<HintNotification id={1} key="test" onClose={jest.fn()} onSuccess={jest.fn()} />);
        expect(tree).toMatchSnapshot();
    });
});

describe('ErrorNotification', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderWithContextAsync(<ErrorNotification id={1} key="test" onClose={jest.fn()} onSuccess={jest.fn()} />);
        expect(tree).toMatchSnapshot();
    });
});

describe('ClearNotification', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderWithContextAsync(<ClearNotification key="test" />);
        expect(tree).toMatchSnapshot();
    });
});

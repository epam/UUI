import React from 'react';
import {
    Alert, ErrorAlert, HintAlert, SuccessAlert, WarningAlert,
} from '../Alert';
import { SvgMock, renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

describe('Alert', () => {
    it('should render with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(<Alert color="info" />);
        expect(tree).toMatchSnapshot();
    });

    it('should render with maximum props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <Alert
                icon={ SvgMock }
                color="success"
                actions={ [
                    {
                        name: 'ACTION 1',
                        action: jest.fn,
                    },
                ] }
                onClose={ jest.fn }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});

describe('WarningAlert', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<WarningAlert />);
        expect(tree).toMatchSnapshot();
    });
});

describe('SuccessAlert', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<SuccessAlert />);
        expect(tree).toMatchSnapshot();
    });
});

describe('HintAlert', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<HintAlert />);
        expect(tree).toMatchSnapshot();
    });
});

describe('ErrorAlert', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<ErrorAlert />);
        expect(tree).toMatchSnapshot();
    });
});

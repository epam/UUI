import React from 'react';
import { renderSnapshotWithContextAsync, renderWithContextAsync, screen } from '@epam/uui-test-utils';
import { DataTable } from '../DataTable';

class ResizeObserverMock {
    observe = () => jest.fn();
    unobserve = () => jest.fn();
    disconnect = () => jest.fn();
}

global.ResizeObserver = ResizeObserverMock;

describe('DataTable', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<DataTable cx="user-class" columns={ [] } getRows={ () => [] } value={ {} } onValueChange={ jest.fn } />);
        expect(tree).toMatchSnapshot();
    });

    it('should have role=table', async () => {
        await renderWithContextAsync(<DataTable columns={ [] } getRows={ () => [] } value={ {} } onValueChange={ jest.fn } />);
        expect(screen.getByRole('table')).toBeInTheDocument();
    });
});

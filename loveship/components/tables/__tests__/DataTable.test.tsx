import React from 'react';
import { renderWithContextAsync } from '@epam/test-utils';
import { demoColumns, dataSource } from './dataMocks';
import { DataTable } from '../DataTable';

class ResizeObserverMock {
    observe = () => jest.fn();
    unobserve = () => jest.fn();
    disconnect = () => jest.fn();
}

global.ResizeObserver = ResizeObserverMock;

describe('DataTable', () => {
    it('should be rendered correctly', async () => {
        const view = dataSource.getView({ topIndex: 0, visibleCount: 20 }, () => {});

        const tree = await renderWithContextAsync(
            <DataTable {...view.getListProps()} columns={demoColumns} getRows={view.getVisibleRows} value={{}} onValueChange={jest.fn()} />
        );

        expect(tree).toMatchSnapshot();
    });
});

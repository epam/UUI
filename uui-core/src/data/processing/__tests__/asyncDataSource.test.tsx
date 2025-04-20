import { act, renderHookWithContextAsync } from '@epam/uui-test-utils';
import { AsyncDataSource } from '../AsyncDataSource';

interface TestItem {
    id: number;
    name: string;
}

describe('AsyncDataSource', () => {
    let apiCallCount = 0;
    const mockData: TestItem[] = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
    ];

    const mockApi = async () => {
        apiCallCount++;
        return mockData;
    };

    beforeEach(() => {
        apiCallCount = 0;
    });

    it.each([
        { reloadVia: 'datasource' },
        { reloadVia: 'view' },
    ])(
        'Should cache API calls, reuse results, and handle %s-triggered reloads',
        async ({ reloadVia }) => {
            const dataSource = new AsyncDataSource({
                api: mockApi,
                getId: (item) => item.id,
            });

            // First view should trigger API
            const { result: result1 } = await renderHookWithContextAsync(
                () => dataSource.useView({}, () => {}, {}),
            );

            const rows1 = result1.current.getVisibleRows();
            expect(rows1.length).toBe(2);
            expect(apiCallCount).toBe(1);

            // Second view should use cache
            const { result: result2 } = await renderHookWithContextAsync(
                () => dataSource.useView({}, () => {}, {}),
            );
            const rows2 = result2.current.getVisibleRows();
            expect(rows2.length).toBe(2);
            expect(apiCallCount).toBe(1); // Should still be 1 as cache was used

            // Trigger reload, either via view, or datasource. This should lead to the same results.
            await act(async () => {
                if (reloadVia === 'view') {
                    result2.current.reload();
                } else {
                    dataSource.reload();
                }
            });

            const reloadedRows1 = result1.current.getVisibleRows();
            expect(reloadedRows1.length).toBe(2);
            const reloadedRows2 = result2.current.getVisibleRows();
            expect(reloadedRows2.length).toBe(2);

            expect(apiCallCount).toBe(2);
        },
    );
});

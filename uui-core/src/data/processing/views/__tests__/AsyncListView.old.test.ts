import { AsyncDataSource } from '../../AsyncDataSource';
import { renderHook, waitFor } from '@epam/uui-test-utils';
import { DataSourceState } from '../../../../types';
import { AsyncListViewProps } from '../types';

interface TItem {
    id: number;
    level: string;
    parentId?: number;
}

const testItems = [
    { id: 2, level: 'A1' },
    { id: 5, level: 'A2+' },
    { id: 1, level: 'A0' },
    { id: 3, level: 'A1+' },
    { id: 4, level: 'A2' },
    { id: 6, level: 'B' },
    { id: 7, level: 'B1+', parentId: 6 },
    { id: 8, level: 'B2', parentId: 6 },
    { id: 9, level: 'B2+', parentId: 6 },
    { id: 10, level: 'C1' },
    { id: 11, level: 'C1+' },
    { id: 12, level: 'C2' },
];

describe('AsyncListView - old tests', () => {
    const initialValue: DataSourceState = { topIndex: 0, visibleCount: 20 };
    const testApi = jest.fn().mockImplementation(() => Promise.resolve(testItems));

    let viewProps: AsyncListViewProps<TItem, number, any>;
    let dataSource: AsyncDataSource<TItem, number>;

    beforeEach(() => {
        testApi.mockClear();
        viewProps = { api: testApi, getId: (i) => i.id };
        dataSource = new AsyncDataSource(viewProps);
    });

    describe('getById', () => {
        it('should return item by id', async () => {
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: { value: initialValue, onValueChange: () => {}, props: {} } },
            );

            let view = hookResult.result.current;
            const loadingRow = view.getById(testItems[4].id, 4);
            expect(loadingRow.isUnknown).toBe(true);
            expect(loadingRow.id).not.toBeNull();

            await waitFor(async () => {
                view = hookResult.result.current;
                const row = view.getById(testItems[4].id, 4);
                expect(row.isUnknown).toBeFalsy();
            });

            const row = view.getById(testItems[4].id, 4);
            expect(row.id).toBe(testItems[4].id);
            expect(row.value).toEqual(testItems[4]);
            expect(row.index).toEqual(4);
        });

        it("should return unknown row if item don't exist in dataSource", async () => {
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: { value: initialValue, onValueChange: () => {}, props: {} } },
            );

            await waitFor(async () => {
                const view = hookResult.result.current;
                const row = view.getById(111, 111);
                expect(row.isUnknown).toBeTruthy();
            });

            const view = hookResult.result.current;
            const row = view.getById(111, 111);
            expect(row.id).not.toBeNull();
        });

        it('should return loading row if item is fetching by dataSource', async () => {
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: { value: { checked: [11], ...initialValue }, onValueChange: () => {}, props: { showSelectedOnly: true } } },
            );

            await waitFor(async () => {
                const view = hookResult.result.current;
                const row = view.getById(11, 11);
                expect(row.isLoading).toBeTruthy();
            });

            const view = hookResult.result.current;
            const row = view.getById(11, 11);
            expect(row.id).not.toBeNull();
        });
    });

    it('should return rows', async () => {
        const hookResult = renderHook(
            ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
            { initialProps: { value: initialValue, onValueChange: () => {}, props: {} } },
        );

        let view = hookResult.result.current;
        let rows = view.getVisibleRows();

        // Should return loading rows for first call
        expect(rows).toHaveLength(20);
        expect(rows[5].isLoading).toBe(true);
        expect(rows[5].id).not.toBeNull();

        await waitFor(async () => {
            view = hookResult.result.current;
            const viewRows = view.getVisibleRows();
            expect(viewRows[5].isLoading).toBeFalsy();
        });

        view = hookResult.result.current;
        rows = view.getVisibleRows();

        expect(rows[5].id).toEqual(testItems[5].id);
        expect(rows).toHaveLength(9);
    });
});

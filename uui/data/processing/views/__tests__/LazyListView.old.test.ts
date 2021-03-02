import { LazyDataSource } from "../../LazyDataSource";
import { LazyListView, LazyListViewProps } from "../LazyListView";
import { DataSourceState, LazyDataSourceApiRequest } from "../../types";

interface TItem {
    id: number;
    level: string;
    parentId?: number;
}

const testItems = [
    { "id": 2, "level": "A1" },
    { "id": 5, "level": "A2+" },
    { "id": 1, "level": "A0" },
    { "id": 3, "level": "A1+" },
    { "id": 4, "level": "A2" },
    { "id": 6, "level": "B" },
    { "id": 7, "level": "B1+", parentId: 6 },
    { "id": 8, "level": "B2", parentId: 6 },
    { "id": 9, "level": "B2+", parentId: 6 },
    { "id": 10, "level": "C1" },
    { "id": 11, "level": "C1+" },
    { "id": 12, "level": "C2" },
];

const delay = () => new Promise(resolve => setTimeout(resolve, 1));

describe('LazyListView - old tests', () => {
    let initialValue: DataSourceState = { topIndex: 0, visibleCount: 20 };
    let testApi = jest.fn(() => Promise.resolve({ items: testItems }));
    let viewProps: LazyListViewProps<TItem, number, any>;
    let dataSource: LazyDataSource<TItem, number>;

    beforeEach(() => {
        testApi.mockClear();
        viewProps = { api: testApi, getId: i => i.id };
        dataSource = new LazyDataSource(viewProps);
    });

    it('should set value', () => {
        const view = dataSource.getView({ topIndex: 1, filter: {} }, () => { }, {});
        expect(view.value).toStrictEqual({ topIndex: 1, filter: {} });
    });

    describe('getById', () => {
        it('should return item by id', async () => {
            const view = dataSource.getView(initialValue, () => { }, {});
            const loadingRow = view.getById(testItems[4].id, 4);
            expect(loadingRow.isLoading).toBe(true);
            expect(loadingRow.id).not.toBeNull();

            await delay();

            const row = view.getById(testItems[4].id, 4);

            expect(row.id).toBe(testItems[4].id);
            expect(row.value).toEqual(testItems[4]);
            expect(row.index).toEqual(4);
        });


        it('should return loading row if item dont exist in dataSource', () => {
            const view = dataSource.getView(initialValue, () => { }, {});
            const row = view.getById(111, 111);

            expect(row.isLoading).toBe(true);
            expect(row.id).not.toBeNull();
        });
    });

    it('should return rows', async () => {
        const view = dataSource.getView(initialValue, () => { }, {});
        let rows = view.getVisibleRows();

        //Should return loading rows for first call
        expect(rows).toHaveLength(20);
        expect(rows[5].isLoading).toBe(true);
        expect(rows[5].id).not.toBeNull();

        await delay();

        rows = view.getVisibleRows();

        expect(rows[5].id).toEqual(testItems[5].id);
        expect(rows).toHaveLength(12);
    });
});
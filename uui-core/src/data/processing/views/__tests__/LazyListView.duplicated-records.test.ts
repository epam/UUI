import { LazyDataSource } from '../../LazyDataSource';
import { LazyListView } from '../LazyListView';
import { delay } from '@epam/uui-test-utils';
import {
    DataSourceState, LazyDataSourceApiRequest, DataQueryFilter, DataRowProps, IEditable,
} from '../../../../types';
import { runDataQuery } from '../../../querying/runDataQuery';

interface TestItem {
    id: number;
    parentId?: number;
    childrenCount?: number;
}

describe('LazyListView with flat list', () => {
    const testData: TestItem[] = [
        { id: 100 }, { id: 110 }, { id: 120 }, { id: 120 }, { id: 121 }, { id: 122 }, { id: 200 }, { id: 300 }, { id: 310 }, { id: 320 }, { id: 330 },
    ];

    const testDataById = (Object as any).fromEntries(testData.map((i) => [i.id, i]));

    let { value, onValueChange }: IEditable<DataSourceState<DataQueryFilter<TestItem>, number>> = {} as any;

    const testApi = (rq: LazyDataSourceApiRequest<TestItem, number, DataQueryFilter<TestItem>>) => Promise.resolve(runDataQuery(testData, rq));

    const flatDataSource = new LazyDataSource({
        api: testApi,
    });

    beforeEach(() => {
        value = { topIndex: 0, visibleCount: 3 };
        onValueChange = (newValue) => {
            value = newValue;
        };
    });

    function expectViewToLookLike(view: LazyListView<TestItem, number>, rows: Partial<DataRowProps<TestItem, number>>[], rowsCount?: number) {
        const viewRows = view.getVisibleRows();
        expect(viewRows).toEqual(rows.map((r) => expect.objectContaining(r)));
        const listProps = view.getListProps();
        rowsCount != null && expect(listProps.rowsCount).toEqual(rowsCount);
    }

    it('can scroll thru plain lists', async () => {
        const ds = flatDataSource;
        let view = ds.getView(value, onValueChange, {});
        expectViewToLookLike(view, [
            { isLoading: true }, { isLoading: true }, { isLoading: true },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        await delay();

        expectViewToLookLike(
            view,
            [
                { id: 100, value: testDataById[100], depth: 0 }, { id: 110, value: testDataById[110], depth: 0 }, { id: 120, value: testDataById[120], depth: 0 },
            ],
            11,
        );

        // Scroll down by 1 row
        view = ds.getView({ topIndex: 1, visibleCount: 3 }, onValueChange, {});
        expectViewToLookLike(view, [
            { id: 110, value: testDataById[110] }, { id: 120, value: testDataById[120] }, { isLoading: true },
        ], 11);

        await delay();

        expectViewToLookLike(
            view,
            [
                { id: 110, value: testDataById[110] }, { id: 120, value: testDataById[120] }, { id: 120, value: testDataById[120] },
            ],
            11,
        );

        // Scroll down to bottom
        view = ds.getView({ topIndex: 8, visibleCount: 3 }, onValueChange, {});

        expectViewToLookLike(view, [
            { isLoading: true }, { isLoading: true }, { isLoading: true },
        ], 11);

        await delay();

        expectViewToLookLike(
            view,
            [
                { id: 310, value: testDataById[310] }, { id: 320, value: testDataById[320] }, { id: 330, value: testDataById[330] },
            ],
            11,
        );
    });
});

describe('LazyListView with tree table', () => {
    const testData: TestItem[] = [
        { id: 100 }, //  0   100
        { parentId: 100, id: 110 }, //  1   110
        { parentId: 100, id: 120 }, //  2     120

        { parentId: 120, id: 121 }, //  3       121
        { parentId: 120, id: 122 }, //  4       122
        { parentId: 120, id: 122 }, //  5       122

        { id: 200 }, //  6   200
        { id: 300 }, //  7   300

        { parentId: 300, id: 310 }, //  8     310
        { parentId: 300, id: 320 }, //  9     320
        { parentId: 300, id: 330 }, //  10    330
    ];

    testData.forEach((i) => {
        i.childrenCount = testData.filter((x) => x.parentId === i.id).length;
    });

    const testDataById = (Object as any).fromEntries(testData.map((i) => [i.id, i]));

    let value: DataSourceState;
    let onValueChanged = (newValue: DataSourceState) => {
        value = newValue;
    };

    const testApi = jest.fn((rq: LazyDataSourceApiRequest<TestItem, number, DataQueryFilter<TestItem>>) => Promise.resolve(runDataQuery(testData, rq)));

    const treeDataSource = new LazyDataSource({
        api: (rq, ctx) =>
            ctx?.parent ? testApi({ ...rq, filter: { ...rq.filter, parentId: ctx.parentId } }) : testApi({ ...rq, filter: { ...rq.filter, parentId: { isNull: true } } }),
        getChildCount: (i) => i.childrenCount,
        getParentId: (i) => i.parentId,
    });

    beforeEach(() => {
        value = { topIndex: 0, visibleCount: 3 };
        onValueChanged = (newValue: DataSourceState) => {
            value = newValue;
        };
        testApi.mockClear();
    });

    it('testApi is ok', async () => {
        const data = await testApi({ filter: { parentId: 100 } });
        expect(data).toEqual({
            items: [testDataById[110], testDataById[120]],
            count: 2,
        });
    });

    function expectViewToLookLike(view: LazyListView<TestItem, number>, rows: Partial<DataRowProps<TestItem, number>>[], rowsCount?: number) {
        const viewRows = view.getVisibleRows();

        rows.forEach((r) => {
            if (r.id) {
                r.value = testDataById[r.id];
            }
        });

        expect(viewRows).toEqual(rows.map((r) => expect.objectContaining(r)));
        const listProps = view.getListProps();
        rowsCount != null && expect(listProps.rowsCount).toEqual(rowsCount);
    }

    it('can load tree, unfold nodes, and scroll down', async () => {
        const ds = treeDataSource;
        let view = ds.getView(value, onValueChanged, {});
        expectViewToLookLike(view, [
            {
                isLoading: true, depth: 0, indent: 0, path: [],
            }, {
                isLoading: true, depth: 0, indent: 0, path: [],
            }, {
                isLoading: true, depth: 0, indent: 0, path: [],
            },
        ]);
        expect(view.getListProps().rowsCount).toBeGreaterThan(3);

        await delay();
        expect(testApi).toBeCalledTimes(1);
        testApi.mockClear();

        expectViewToLookLike(
            view,
            [
                {
                    id: 100, isFoldable: true, isFolded: true, path: [],
                }, { id: 200, isFoldable: false, path: [] }, {
                    id: 300, isFoldable: true, isFolded: true, path: [],
                },
            ],
            3,
        );

        // // Unfold some rows
        let rows = view.getVisibleRows();
        value.visibleCount = 6;
        view = ds.getView(value, onValueChanged, {});
        rows[0].onFold?.(rows[0]);
        view = ds.getView(value, onValueChanged, {});
        expectViewToLookLike(
            view,
            [
                { id: 100, depth: 0, indent: 1 },
                { isLoading: true, depth: 1, indent: 2 },
                { isLoading: true, depth: 1, indent: 2 },
                { id: 200, depth: 0, indent: 1 },
                { id: 300, depth: 0, indent: 1 },
            ],
            5,
        ); // even we don't know if there are children of a children of #100, we understand that there's no row below 300, so we need to receive exact rows count here

        await delay();

        expectViewToLookLike(
            view,
            [
                {
                    id: 100, isFolded: false, depth: 0, indent: 1, isFoldable: true,
                }, {
                    id: 110, depth: 1, indent: 2, isFoldable: false,
                }, {
                    id: 120, depth: 1, indent: 2, isFoldable: true,
                }, { id: 200, depth: 0, indent: 1 }, { id: 300, depth: 0, indent: 1 },
            ],
            5,
        );

        // // Unfold more rows
        rows = view.getVisibleRows();
        rows[2].onFold?.(rows[2]);
        value.visibleCount = 5;
        // value.topIndex = 5;

        view = ds.getView(value, onValueChanged, {});

        expectViewToLookLike(view, [
            {
                id: 100, isFolded: false, depth: 0, indent: 1, isFoldable: true,
            }, {
                id: 110, depth: 1, indent: 2, isFoldable: false,
            }, {
                id: 120, depth: 1, indent: 2, isFoldable: true,
            }, { isLoading: true, depth: 2, indent: 3 }, { isLoading: true, depth: 2, indent: 3 },
        ]);

        await delay();

        expectViewToLookLike(view, [
            {
                id: 100, isFolded: false, depth: 0, indent: 1, isFoldable: true,
            }, {
                id: 110, depth: 1, indent: 2, isFoldable: false,
            }, {
                id: 120, depth: 1, indent: 2, isFoldable: true,
            }, {
                id: 121, depth: 2, indent: 3, isFoldable: false,
            }, {
                id: 122, depth: 2, indent: 3, isFoldable: false,
            },
        ]);

        value.visibleCount = 4;
        value.topIndex = 4;

        expect(view.getListProps().rowsCount).toBeGreaterThan(5);

        view = ds.getView(value, onValueChanged, {});

        expectViewToLookLike(view, [
            { id: 122, depth: 2, isFoldable: false }, { isLoading: true, depth: 2 }, { id: 200, depth: 0, indent: 1 }, { id: 300, depth: 0, indent: 1 },
        ]);

        await delay();

        expectViewToLookLike(view, [
            {
                id: 122, depth: 2, indent: 3, isFoldable: false,
            }, {
                id: 122, depth: 2, indent: 3, isFoldable: false,
            }, { id: 200, depth: 0, indent: 1 }, { id: 300, depth: 0, indent: 1 },
        ]);

        // // Scroll down to bottom
        value.topIndex = 6;
        view = ds.getView(value, onValueChanged, {});

        expectViewToLookLike(
            view,
            [{ id: 200, depth: 0, indent: 1 }, { id: 300, depth: 0, indent: 1 }],
            8,
        );
    });
});

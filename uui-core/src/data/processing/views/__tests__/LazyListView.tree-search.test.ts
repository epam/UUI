import { DataQueryFilter, DataSourceState, LazyDataSourceApiRequest } from '../../../../types';
import { runDataQuery } from '../../../querying';
import { LazyDataSource } from '../../LazyDataSource';
import { delay } from '@epam/test-utils';

interface TestItem {
    name: string;
    id: number;
    parentId?: number;
    childrenCount?: number;
}
describe('LazyListView', () => {
    const testData: TestItem[] = [
        { id: 100, name: 'A1' }, { id: 110, name: 'AA2', parentId: 100 }, { id: 111, name: 'AA3', parentId: 110 }, { id: 112, name: 'AA4', parentId: 110 }, { id: 113, name: 'AA5', parentId: 110 }, { id: 114, name: 'AA6', parentId: 110 }, { id: 115, name: 'AA7', parentId: 110 }, { id: 116, name: 'AA8', parentId: 110 }, { id: 120, name: 'AB9', parentId: 100 }, { id: 121, name: 'ABC1', parentId: 120 }, { id: 122, name: 'ABC2', parentId: 120 }, { id: 123, name: 'ABC3', parentId: 120 }, { id: 124, name: 'ABC4', parentId: 120 }, { id: 125, name: 'ABC5', parentId: 120 }, { id: 200, name: 'B1' }, { id: 300, name: 'C1' }, { id: 400, name: 'D1' }, { id: 500, name: 'E1' }, { id: 600, name: 'F1' }, { id: 700, name: 'G1' }, { id: 800, name: 'H1' }, { id: 900, name: 'I1' },
    ];

    testData.forEach((i) => {
        i.childrenCount = testData.filter((x) => x.parentId == i.id).length;
    });

    let value: DataSourceState = { visibleCount: 5 };
    const onValueChanged = (newValue: DataSourceState) => {
        value = newValue;
    };

    const testApi = jest.fn((rq: LazyDataSourceApiRequest<TestItem, number, DataQueryFilter<TestItem>>) => Promise.resolve(runDataQuery(testData, rq)));
    const api = (rq, ctx) => {
        const search = ctx?.parentId ? undefined : rq.search;
        const filter = search ? { ...rq.filter } : { ...rq.filter, parentId: ctx?.parentId };
        return testApi({ ...rq, filter, search });
    };

    const ds = new LazyDataSource({ api, getChildCount: (i) => i.childrenCount });
    const viewProps = {
        flattenSearchResults: true,
        getRowOptions: (i) => ({ checkbox: { isVisible: true } }),
        isFoldedByDefault: (i) => false,
        getParentId: (i) => i.parentId,
        getId: (i) => i.id,
        api,
    };

    const getView = () => ds.getView(value, onValueChanged, viewProps);

    const view = getView();

    it('should search for nested children and build correct path, indent, depth, isLastChild', async () => {
        view.update({ search: 'ABC5', topIndex: 0, visibleCount: 20 }, viewProps);

        view.getVisibleRows();
        await delay();
        const rows = view.getVisibleRows();

        expect(rows).toHaveLength(1);
        expect(rows).toEqual([
            expect.objectContaining({
                id: 125,
                depth: 2,
                indent: 0,
                index: 0,
                parentId: 120,
                path: [
                    { id: 100, isLastChild: false, value: { childrenCount: 2, id: 100, name: 'A1' } }, {
                        id: 120,
                        isLastChild: false,
                        value: {
                            childrenCount: 5, id: 120, name: 'AB9', parentId: 100,
                        },
                    },
                ],
                isLastChild: true,
                value: {
                    childrenCount: 0, id: 125, name: 'ABC5', parentId: 120,
                },
            }),
        ]);
    });

    it('should detect if found item is last child in parent', async () => {
        view.update({ search: 'ABC', topIndex: 0, visibleCount: 20 }, viewProps);

        view.getVisibleRows();
        await delay();
        const rows = view.getVisibleRows();

        expect(rows).toHaveLength(5);
        const path = [
            { id: 100, isLastChild: false, value: { childrenCount: 2, id: 100, name: 'A1' } }, {
                id: 120,
                isLastChild: false,
                value: {
                    childrenCount: 5, id: 120, name: 'AB9', parentId: 100,
                },
            },
        ];
        expect(rows).toEqual(
            [
                {
                    id: 121,
                    depth: 2,
                    indent: 0,
                    index: 0,
                    parentId: 120,
                    path,
                    isLastChild: false,
                    value: {
                        childrenCount: 0, id: 121, name: 'ABC1', parentId: 120,
                    },
                }, {
                    id: 122,
                    depth: 2,
                    indent: 0,
                    index: 1,
                    parentId: 120,
                    path,
                    isLastChild: false,
                    value: {
                        childrenCount: 0, id: 122, name: 'ABC2', parentId: 120,
                    },
                }, {
                    id: 123,
                    depth: 2,
                    indent: 0,
                    index: 2,
                    parentId: 120,
                    path,
                    isLastChild: false,
                    value: {
                        childrenCount: 0, id: 123, name: 'ABC3', parentId: 120,
                    },
                }, {
                    id: 124,
                    depth: 2,
                    indent: 0,
                    index: 3,
                    parentId: 120,
                    path,
                    isLastChild: false,
                    value: {
                        childrenCount: 0, id: 124, name: 'ABC4', parentId: 120,
                    },
                }, {
                    id: 125,
                    depth: 2,
                    indent: 0,
                    index: 4,
                    parentId: 120,
                    path,
                    isLastChild: true,
                    value: {
                        childrenCount: 0, id: 125, name: 'ABC5', parentId: 120,
                    },
                },
            ].map(expect.objectContaining),
        );
    });
});

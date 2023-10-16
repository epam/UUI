import { DataSourceState, LazyDataSourceApi, DataQueryFilter } from '../../../../types';
import { runDataQuery } from '../../../querying/runDataQuery';
import { ITree, LoadTreeOptions, Tree } from '../tree';

interface TestItem {
    id: number;
    parentId?: number;
    name?: string;
    childrenCount?: number;
    isDeleted?: boolean;
}

const testData: TestItem[] = [
    { id: 100, name: 'name 1' }, //  0   100
    { id: 110, parentId: 100, name: 'name 2' }, //  1   110
    { id: 120, parentId: 100, name: 'name 3' }, //  2     120
    { id: 121, parentId: 120, name: 'name 4' }, //  3       121
    { id: 122, parentId: 120, name: 'name 5' }, //  4       122
    { id: 200, name: 'name 6' }, //  5   200
    { id: 300, name: 'name 7' }, //  6   300
    { id: 310, parentId: 300, name: 'name 10' }, //  7     310
    { id: 320, parentId: 300, name: 'name 11' }, //  8     320
    { id: 330, parentId: 300, name: 'name 12' }, //  9     330
    { id: 340, parentId: 300, name: 'name 13' }, //  9     330
    { id: 350, parentId: 300, name: 'name 14' }, //  9     330
];

const testDataById: Record<number, TestItem> = {};

testData.forEach((i) => {
    i.childrenCount = testData.filter((x) => x.parentId === i.id).length;
    testDataById[i.id] = i;
});

const blankTree = Tree.blank<TestItem, number>({
    getId: (i) => i.id,
    getParentId: (i) => i.parentId,
});

describe('Tree - patch', () => {
    const testApiFn: LazyDataSourceApi<TestItem, number, DataQueryFilter<TestItem>> = (rq, ctx) => {
        rq.filter = rq.filter || {};
        if (rq.ids) {
            rq.filter.id = { in: rq.ids };
        }
        rq.filter.parentId = ctx?.parent ? ctx.parent.id : undefined;
        const result = runDataQuery(testData, rq);
        return Promise.resolve(result);
    };

    const testApi = jest.fn(testApiFn);
    const loadParams: LoadTreeOptions<TestItem, number, DataQueryFilter<TestItem>> = {
        api: testApi,
        getChildCount: (i) => i.childrenCount ?? 0,
        isFolded: () => true,
    };

    const value: DataSourceState = { topIndex: 0, visibleCount: 100 };
    let tree: ITree<TestItem, number>;

    beforeEach(async () => {
        tree = await blankTree.load({ ...loadParams, isFolded: () => false }, value);
    });

    it('should delete items from the top level', () => {
        const patchedTree = tree.patch([{ id: 300, isDeleted: true }], 'isDeleted');
        expect(patchedTree['byId'].has(300)).toBeFalsy();
        expect(patchedTree['byParentId'].has(300)).toBeFalsy();
        expect(patchedTree === tree).toBeFalsy();
    });

    it('should delete items from the nested layer', () => {
        const patchedTree = tree.patch([{ id: 320, parentId: 300, isDeleted: true }], 'isDeleted');
        expect(patchedTree['byId'].has(320)).toBeFalsy();
        expect(patchedTree['byParentId'].has(320)).toBeFalsy();
        expect(patchedTree['byParentId'].get(300)).toEqual([
            310, 330, 340, 350,
        ]);
        expect(patchedTree === tree).toBeFalsy();
    });

    it('should update items at the top level', () => {
        const patchedItem = { id: 300, name: 'new name' };
        const patchedTree = tree.patch([patchedItem], 'isDeleted');
        expect(patchedTree['byId'].has(300)).toBeTruthy();
        expect(patchedTree['byParentId'].has(300)).toBeTruthy();
        expect(patchedTree === tree).toBeFalsy();
        expect(patchedTree['byId'].get(300)).toEqual(patchedItem);
    });

    it('should update items at the nested layer', () => {
        const patchedItem = { id: 320, parentId: 300, name: 'new name' };
        const patchedTree = tree.patch([patchedItem], 'isDeleted');
        expect(patchedTree['byId'].has(320)).toBeTruthy();
        expect(patchedTree['byParentId'].has(300)).toBeTruthy();
        expect(patchedTree['byParentId'].get(300)).toEqual([
            310, 320, 330, 340, 350,
        ]);
        expect(patchedTree === tree).toBeFalsy();
        expect(patchedTree['byId'].get(320)).toEqual(patchedItem);
    });

    it('should move item to the other parent', () => {
        const patchedItem = { id: 320, parentId: 200, name: 'new name' };
        const patchedTree = tree.patch([patchedItem], 'isDeleted');
        expect(patchedTree['byId'].has(320)).toBeTruthy();
        expect(patchedTree['byParentId'].has(200)).toBeTruthy();
        expect(patchedTree['byParentId'].get(200)).toEqual([320]);
        expect(patchedTree['byParentId'].get(300)).toEqual([
            310, 330, 340, 350,
        ]);
        expect(patchedTree === tree).toBeFalsy();
        expect(patchedTree['byId'].get(320)).toEqual(patchedItem);
    });

    it('should put item to the beginning of the list if comparator returns -1', () => {
        const patchedItem = { id: 320, parentId: 100, name: 'new name' };
        const patchedTree = tree.patch([patchedItem], 'isDeleted', () => -1);
        expect(patchedTree['byId'].has(320)).toBeTruthy();
        expect(patchedTree['byParentId'].has(100)).toBeTruthy();
        expect(patchedTree['byParentId'].get(100)).toEqual([
            320, 110, 120,
        ]);
        expect(patchedTree['byParentId'].get(300)).toEqual([
            310, 330, 340, 350,
        ]);
        expect(patchedTree === tree).toBeFalsy();
        expect(patchedTree['byId'].get(320)).toEqual(patchedItem);
    });

    it('should put items in the right order if comparator returns -1', () => {
        const patchedItem1 = { id: 130, parentId: 100, name: 'new name' };
        const patchedItem2 = { id: 140, parentId: 100, name: 'new name 1' };
        const patchedTree = tree.patch([patchedItem1, patchedItem2], 'isDeleted', () => -1);

        expect(patchedTree['byId'].has(130)).toBeTruthy();
        expect(patchedTree['byId'].has(140)).toBeTruthy();
        expect(patchedTree['byParentId'].has(100)).toBeTruthy();
        expect(patchedTree['byParentId'].get(100)).toEqual([
            140, 130, 110, 120,
        ]);
        expect(patchedTree === tree).toBeFalsy();
        expect(patchedTree['byId'].get(130)).toEqual(patchedItem1);
        expect(patchedTree['byId'].get(140)).toEqual(patchedItem2);
    });

    it('should put items in the right order if comparator returns 1', () => {
        const patchedItem1 = { id: 130, parentId: 100, name: 'new name' };
        const patchedItem2 = { id: 140, parentId: 100, name: 'new name 1' };
        const patchedTree = tree.patch([patchedItem1, patchedItem2], 'isDeleted', () => 1);

        expect(patchedTree['byId'].has(130)).toBeTruthy();
        expect(patchedTree['byId'].has(140)).toBeTruthy();
        expect(patchedTree['byParentId'].has(100)).toBeTruthy();
        expect(patchedTree['byParentId'].get(100)).toEqual([
            110, 120, 130, 140,
        ]);
        expect(patchedTree === tree).toBeFalsy();
        expect(patchedTree['byId'].get(130)).toEqual(patchedItem1);
        expect(patchedTree['byId'].get(140)).toEqual(patchedItem2);
    });

    it('should move item to the other parent into exact place', () => {
        const patchedItem = { id: 320, parentId: 100, name: 'new name' };
        const patchedTree = tree.patch([patchedItem], 'isDeleted', (_, { id: existingId }) => (existingId < 120 ? 1 : -1));
        expect(patchedTree['byId'].has(320)).toBeTruthy();
        expect(patchedTree['byParentId'].has(100)).toBeTruthy();
        expect(patchedTree['byParentId'].get(100)).toEqual([
            110, 320, 120,
        ]);
        expect(patchedTree['byParentId'].get(300)).toEqual([
            310, 330, 340, 350,
        ]);
        expect(patchedTree === tree).toBeFalsy();
        expect(patchedTree['byId'].get(320)).toEqual(patchedItem);
    });

    it('should add item to the top level', () => {
        const newItem = { id: 400, name: 'some new item' };
        const patchedTree = tree.patch([newItem], 'isDeleted');
        expect(patchedTree['byId'].has(400)).toBeTruthy();
        expect(patchedTree === tree).toBeFalsy();
        expect(patchedTree['byId'].get(400)).toEqual(newItem);
    });

    it('should add item into exact place', () => {
        const newItem = { id: 335, name: 'some new item', parentId: 300 };
        const patchedTree = tree.patch([newItem], 'isDeleted', ({ id }, { id: existingId }) => (id > existingId ? 1 : -1));
        expect(patchedTree['byId'].has(335)).toBeTruthy();
        expect(patchedTree === tree).toBeFalsy();
        expect(patchedTree['byId'].get(335)).toEqual(newItem);
        expect(patchedTree['byParentId'].get(300)).toEqual([
            310, 320, 330, 335, 340, 350,
        ]);
    });

    it('should add, update and delete items during patch', () => {
        const deletedItem = { id: 350, parentId: 300, isDeleted: true };
        const updatedItem = { id: 310, parentId: 300, name: 'new name' };
        const newItem = { id: 335, name: 'some new item', parentId: 300 };
        const patchedTree = tree.patch([
            deletedItem, updatedItem, newItem,
        ], 'isDeleted', ({ id }, { id: existingId }) => (id > existingId ? 1 : -1));
        expect(patchedTree['byId'].has(deletedItem.id)).toBeFalsy();
        expect(patchedTree['byId'].has(updatedItem.id)).toBeTruthy();
        expect(patchedTree['byId'].has(newItem.id)).toBeTruthy();

        expect(patchedTree['byId'].get(updatedItem.id)).toEqual(updatedItem);
        expect(patchedTree['byId'].get(newItem.id)).toEqual(newItem);
        expect(patchedTree === tree).toBeFalsy();

        expect(patchedTree['byParentId'].get(newItem.parentId)).toEqual([
            310, 320, 330, 335, 340,
        ]);
    });

    it('should not update tree if items were not updated', () => {
        const updatedItem = testData[1];
        const patchedTree = tree.patch([updatedItem]);
        expect(patchedTree['byId'].has(updatedItem.id)).toBeTruthy();
        expect(patchedTree['byId'].get(updatedItem.id)).toEqual(updatedItem);
        expect(patchedTree === tree).toBeTruthy();

        expect(patchedTree['byParentId'].get(updatedItem.parentId)).toEqual([110, 120]);

        const updatedItem2 = testData[2];
        const patchedTree2 = tree.patch([updatedItem2], 'isDeleted', ({ id }, { id: existingId }) => (id > existingId ? 1 : -1));
        expect(patchedTree2['byId'].has(updatedItem2.id)).toBeTruthy();
        expect(patchedTree2['byId'].get(updatedItem2.id)).toEqual(updatedItem2);
        expect(patchedTree2 === tree).toBeTruthy();

        expect(patchedTree2['byParentId'].get(updatedItem.parentId)).toEqual([110, 120]);
    });
});

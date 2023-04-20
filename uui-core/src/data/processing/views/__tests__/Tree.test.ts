import { SortingOption } from '../../../../types';
import { Tree } from '../tree';

interface TestItem {
    id: number;
    parentId?: number;
    name?: string;
    value?: number;
}

const testData: TestItem[] = [
    { id: 100, value: 3, name: 'item1' }, //  0   100
    { id: 110, parentId: 100, value: 1, name: 'item10' }, //  1   110
    { id: 120, parentId: 100, value: 2, name: 'item11' }, //  2     120
    { id: 121, parentId: 120, value: 3, name: 'item12' }, //  3       121
    { id: 122, parentId: 120, value: 4, name: 'item13' }, //  4       122
    { id: 200, value: 5, name: 'item2' }, //  5   200
    { id: 300, value: 1, name: 'item3' }, //  6   300
    { id: 310, parentId: 300, value: 3, name: 'item30' }, //  7     310
    { id: 320, parentId: 300, value: 2, name: 'item31' }, //  8     320
    { id: 330, parentId: 300, value: 1, name: 'item32' }, //  9     330
];

const blankTree = Tree.blank<TestItem, number>({ getId: (i) => i.id, getParentId: (i) => i.parentId });

const testTree = blankTree.patch(testData);

//const treeWithValues = testTree.

describe('Tree', () => {
    describe('basic queries', () => {
        it('getById', () => {
            expect(testTree.getById(100)).toBe(testData[0]);
        });

        it('getChildrenByParentId', () => {
            const nodes = testTree.getChildrenByParentId(100);
            expect(nodes).toEqual([testTree.getById(110), testTree.getById(120)]);
        });

        it('getRootItems', () => {
            const parents = testTree.getRootItems();
            const parentIds = parents.map((item) => item.id);
            expect(parentIds).toEqual([100, 200, 300]);
        });

        it('getParentIdsRecursive', () => {
            const parentIds = testTree.getParentIdsRecursive(122);
            expect(parentIds).toEqual([100, 120]);
        });

        it('getParents', () => {
            const parents = testTree.getParents(122);
            expect(parents).toEqual([
                { id: 100, value: 3, name: 'item1' },
                { id: 120, parentId: 100, value: 2, name: 'item11' },
            ]);
        });

        it('getPathById', () => {
            const path = testTree.getPathById(122);
            expect(path).toEqual([
                {
                    id: 100,
                    isLastChild: false,
                    value: { id: 100, value: 3, name: 'item1' },
                },
                {
                    id: 120,
                    isLastChild: true,
                    value: { id: 120, parentId: 100, value: 2, name: 'item11' },
                },
            ]);
        });

        it('getPathItem', () => {
            const pathItem = testTree.getPathItem(testData[4]);
            expect(pathItem).toEqual({
                id: 122,
                isLastChild: true,
                value: { id: 122, parentId: 120, value: 4, name: 'item13' },
            });
        });
    });

    describe('append', () => {
        it('can append new root item by id', () => {
            const newTree = testTree.patch([{ id: 400 }]);
            expect(newTree.getById(400)).toEqual({ id: 400 });
            expect(newTree.getRootItems().map((n) => n.id)).toEqual([100, 200, 300, 400]);
        });

        it('can append new child item by id', () => {
            const newTree = testTree.patch([{ id: 130, parentId: 100 }]);
            expect(newTree.getById(130)).toEqual({ id: 130, parentId: 100 });
            expect(newTree.getChildrenByParentId(100).map((n) => n.id)).toEqual([110, 120, 130]);
        });

        it('can move node to a new parent', () => {
            const newTree = testTree.patch([{ id: 110, parentId: 100 }]);
            // TBD
            // expect(newTree.getNodeById(130)).toEqual(
            //     { id: 130, key: '130', parentId: 100, index: 2, item: { id: 130, parentId: 100 }}
            // );
            // expect(newTree.getNodesByParentId(100).map(n => n.id)).toEqual([110, 120, 130]);
        });
    });

    describe('forEach', () => {
        const testForeach = (tree: typeof blankTree, options: Parameters<typeof blankTree.forEach>[1], resultIds: number[]) => {
            const visited: { item: TestItem; id: number; parentId: number }[] = [];
            tree.forEach((item, id, parentId) => {
                visited.push({ item, id, parentId });
            }, options);
            const reference = resultIds.map((id) => tree.getById(id)).map((item) => ({ id: item?.id, item, parentId: item?.parentId }));
            expect(visited).toEqual(reference);
        };

        it('can iterate empty tree', () => {
            testForeach(blankTree, {}, []);
        });

        it('can iterate top-down a node', () => {
            testForeach(testTree, { parentId: 100 }, [100, 110, 120, 121, 122]);
        });

        it('can iterate top-down a node (exclude parent)', () => {
            testForeach(testTree, { parentId: 100, includeParent: false }, [110, 120, 121, 122]);
        });

        it('can iterate bottom-up a node', () => {
            testForeach(testTree, { parentId: 100, direction: 'bottom-up' }, [110, 121, 122, 120, 100]);
        });

        it('can iterate bottom-up a node (exclude parent)', () => {
            testForeach(testTree, { parentId: 100, direction: 'bottom-up', includeParent: false }, [110, 121, 122, 120]);
        });

        it('can iterate top-down whole tree', () => {
            testForeach(testTree, null, [100, 110, 120, 121, 122, 200, 300, 310, 320, 330]);
        });

        it('can iterate bottom-up whole tree', () => {
            testForeach(testTree, { direction: 'bottom-up' }, [110, 121, 122, 120, 100, 200, 310, 320, 330, 300]);
        });
    });

    describe('computeSubtotals', () => {
        it('can calculate child counts', () => {
            const subtotals = testTree.computeSubtotals(
                (_) => 1,
                (a, b) => a + b
            );
            expect(subtotals.get(100)).toBe(5);
            expect(subtotals.get(120)).toBe(3);
            expect(subtotals.get(121)).toBe(1);
            expect(subtotals.get(200)).toBe(1);
            expect(subtotals.get(300)).toBe(4);
            expect(subtotals.get(undefined)).toBe(10);
        });

        it('can sum values', () => {
            const subtotals = testTree.computeSubtotals(
                (item) => item.value || 0,
                (a, b) => a + b
            );
            expect(subtotals.get(100)).toBe(13);
            expect(subtotals.get(120)).toBe(9);
            expect(subtotals.get(121)).toBe(3);
            expect(subtotals.get(200)).toBe(5);
            expect(subtotals.get(300)).toBe(7);
            expect(subtotals.get(undefined)).toBe(25);
        });

        it('can sum values (children only)', () => {
            const subtotals = testTree.computeSubtotals(
                (item, hasChildren) => (hasChildren ? 0 : item.value || 0),
                (a, b) => a + b
            );
            expect(subtotals.get(100)).toBe(8);
            expect(subtotals.get(120)).toBe(7);
            expect(subtotals.get(121)).toBe(3);
            expect(subtotals.get(200)).toBe(5);
            expect(subtotals.get(300)).toBe(6);
            expect(subtotals.get(undefined)).toBe(19);
        });
    });

    describe('cascadeSelection', () => {
        describe('cascade = false', () => {
            it('can select single', () => {
                const selection = testTree.cascadeSelection([100], 200, true, { cascade: false }).sort();
                expect(selection).toEqual([100, 200]);
            });

            it('can un-select single', () => {
                const selection = testTree.cascadeSelection([100], 200, false, { cascade: false }).sort();
                expect(selection).toEqual([100]);
            });
        });

        describe("cascade = true or cascade = 'explicit'", () => {
            it('can select single', () => {
                const selection = testTree.cascadeSelection([200], 100, true).sort();
                expect(selection).toEqual([100, 110, 120, 121, 122, 200]);
            });

            it('can un-select single (cascade = true)', () => {
                const selection = testTree.cascadeSelection([100, 110, 120, 121, 200], 100, false).sort();
                expect(selection).toEqual([200]);
            });

            it("can un-select single (cascade = 'explicit')", () => {
                const selection = testTree.cascadeSelection([100, 110, 120, 121, 200], 100, false, { cascade: 'explicit' }).sort();
                expect(selection).toEqual([200]);
            });

            it('it selects parents when all children are checked (cascade = true)', () => {
                const selection = testTree.cascadeSelection([100, 110, 121, 200], 122, true).sort();
                expect(selection).toEqual([100, 110, 120, 121, 122, 200]);
            });

            it("it selects parents when all children are checked (cascade = 'explicit')", () => {
                const selection = testTree.cascadeSelection([100, 110, 121, 200], 122, true, { cascade: 'explicit' }).sort();
                expect(selection).toEqual([100, 110, 120, 121, 122, 200]);
            });

            it('it unselects parents when any children is unchecked (cascade = true)', () => {
                const selection = testTree.cascadeSelection([100, 110, 120, 121, 122, 200], 121, false).sort();
                expect(selection).toEqual([110, 122, 200]);
            });

            it("it unselects parents when any children is unchecked (cascade = 'explicit')", () => {
                const selection = testTree.cascadeSelection([100, 110, 120, 121, 122, 200], 121, false, { cascade: 'explicit' }).sort();
                expect(selection).toEqual([110, 122, 200]);
            });

            it('can unselect all (cascade = true)', () => {
                const selection = testTree.cascadeSelection([100, 110, 120, 122, 200], undefined, false).sort();
                expect(selection).toEqual([]);
            });

            it("can unselect all (cascade = 'explicit')", () => {
                const selection = testTree.cascadeSelection([100, 110, 120, 122, 200], undefined, false, { cascade: 'explicit' }).sort();
                expect(selection).toEqual([]);
            });

            it('can select all (cascade = true)', () => {
                const selection = testTree.cascadeSelection([200], undefined, true, { cascade: true }).sort();
                const allTestTreeIds = testData.map((i) => i.id).sort();
                expect(selection).toEqual(allTestTreeIds);
            });

            it("can select all (cascade = 'explicit')", () => {
                const selection = testTree.cascadeSelection([100], undefined, true, { cascade: 'explicit' }).sort();
                const allTestTreeIds = testData.map((i) => i.id).sort();
                expect(selection).toEqual(allTestTreeIds);
            });
        });

        describe("cascade = 'implicit'", () => {
            it('can select single', () => {
                const selection = testTree.cascadeSelection([200], 100, true, { cascade: 'implicit' }).sort();
                expect(selection).toEqual([100, 200]);
            });

            it('can un-select single', () => {
                const selection = testTree.cascadeSelection([100, 200], 100, false, { cascade: 'implicit' }).sort();
                expect(selection).toEqual([200]);
            });

            it('can unselect child of selected parent', () => {
                const selection = testTree.cascadeSelection([100], 122, false, { cascade: 'implicit' }).sort();
                expect(selection).toEqual([110, 121]);
            });

            it('can collapse explicitly selected children if parent was selected', () => {
                const selection = testTree.cascadeSelection([122], 100, true, { cascade: 'implicit' }).sort();
                expect(selection).toEqual([100]);
            });

            it('can collapse children to one parent, if all children were selected explicitly', () => {
                const selection = testTree.cascadeSelection([121], 122, true, { cascade: 'implicit' }).sort();
                expect(selection).toEqual([120]);
            });
        });
    });

    describe('sort', () => {
        it('should return sorted tree', () => {
            const sortedTree = testTree.sort({ sorting: [{ field: 'value', direction: 'asc' }] });
            expect(sortedTree.getRootIds()).toEqual([300, 100, 200]);
            expect(sortedTree.getChildrenByParentId(100).map((n) => n.id)).toEqual([110, 120]);
            expect(sortedTree.getChildrenByParentId(120).map((n) => n.id)).toEqual([121, 122]);
            expect(sortedTree.getChildrenByParentId(300).map((n) => n.id)).toEqual([330, 320, 310]);
        });

        it('should return sorted tree by sortBy function', () => {
            const sortBy = (i: TestItem, sorting: SortingOption) => i[sorting.field as keyof TestItem] || '';

            const sortedTree = testTree.sort({ sorting: [{ field: 'value', direction: 'asc' }], sortBy });
            expect(sortedTree.getRootIds()).toEqual([300, 100, 200]);
            expect(sortedTree.getChildrenByParentId(100).map((n) => n.id)).toEqual([110, 120]);
            expect(sortedTree.getChildrenByParentId(120).map((n) => n.id)).toEqual([121, 122]);
            expect(sortedTree.getChildrenByParentId(300).map((n) => n.id)).toEqual([330, 320, 310]);
        });
    });

    describe('search', () => {
        it('should return sorted tree', () => {
            const searchTree = testTree.search({ search: 'item3', getSearchFields: ({ name }) => [name] });

            expect(searchTree.getRootIds()).toEqual([300]);
            expect(searchTree.getChildrenByParentId(300).map((n) => n.id)).toEqual([310, 320, 330]);
        });
    });

    describe('filter', () => {
        it('should return filtered tree', () => {
            const searchTree = testTree.filter({
                filter: ({ value }: TestItem) => value > 3,
                getFilter: (filter) => (item) => filter(item),
            });

            expect(searchTree.getRootIds()).toEqual([100, 200]);
            expect(searchTree.getChildrenByParentId(100).map((n) => n.id)).toEqual([120]);
            expect(searchTree.getChildrenByParentId(120).map((n) => n.id)).toEqual([122]);
        });
    });
});

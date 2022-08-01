import { Tree } from "../Tree";

interface TestItem {
    id: number;
    parentId?: number;
    name?: string;
    value?: number;
}

const testData: TestItem[] = [
    { id: 100, value: 3 }, //  0   100
    { id: 110, parentId: 100, value: 1 }, //  1   110
    { id: 120, parentId: 100, value: 2 }, //  2     120
    { id: 121, parentId: 120, value: 3 }, //  3       121
    { id: 122, parentId: 120, value: 4 }, //  4       122
    { id: 200, value: 5 }, //  5   200
    { id: 300 }, //  6   300
    { id: 310, parentId: 300, value: 3 }, //  7     310
    { id: 320, parentId: 300, value: 2 }, //  8     320
    { id: 330, parentId: 300, value: 1 }, //  9     330
];

const blankTree = Tree.blank<TestItem, number>({ getId: i => i.id, getParentId: i => i.parentId });

const testTree = blankTree.append(testData);

//const treeWithValues = testTree.

describe('Tree', () => {
    describe('basic queries', () => {
        it('can get items by id', () => {
            expect(testTree.getById(100)).toBe(testData[0]);
        })

        it('can get children by parent Id', () => {
            const nodes = testTree.getNodesByParentId(100);
            expect(nodes).toEqual([
                { id: 110, key: '110', parentId: 100, index: 0, item: testTree.getById(110) },
                { id: 120, key: '120', parentId: 100, index: 1, item: testTree.getById(120) },
            ]);
        })
    });

    describe('append', () => {
        it('can append new root item by id', () => {
            const newTree = testTree.append([{ id: 400 }]);
            expect(newTree.getNodeById(400)).toEqual(
                { id: 400, key: '400', parentId: undefined, index: 3, item: { id: 400 }}
            );
            expect(newTree.getRootNodes().map(n => n.id)).toEqual([100, 200, 300, 400]);
        })

        it('can append new child item by id', () => {
            const newTree = testTree.append([{ id: 130, parentId: 100 }]);
            expect(newTree.getNodeById(130)).toEqual(
                { id: 130, key: '130', parentId: 100, index: 2, item: { id: 130, parentId: 100 }}
            );
            expect(newTree.getNodesByParentId(100).map(n => n.id)).toEqual([110, 120, 130]);
        })

        it('can move node to a new parent', () => {
            const newTree = testTree.append([{ id: 110, parentId: 100 }]);
            // TBD
            // expect(newTree.getNodeById(130)).toEqual(
            //     { id: 130, key: '130', parentId: 100, index: 2, item: { id: 130, parentId: 100 }}
            // );
            // expect(newTree.getNodesByParentId(100).map(n => n.id)).toEqual([110, 120, 130]);
        })
    });

    // it('can retrieve all parent nodes', () => {
    //     const parents = testTree.getAllParentNodes();
    //     expect(parents.map(node => node.id)).toEqual([
    //         [100, 300, 120]
    //     ]);
    //     // TBD
    //     // expect(newTree.getNodeById(130)).toEqual(
    //     //     { id: 130, key: '130', parentId: 100, index: 2, item: { id: 130, parentId: 100 }}
    //     // );
    //     // expect(newTree.getNodesByParentId(100).map(n => n.id)).toEqual([110, 120, 130]);
    // })

    describe('forEachChildrenRecursively', () => {
        it('can iterate empty tree', () => {
            const visited: number[] = [];
            blankTree.forEach(node => { visited.push(node.id) });
            expect(visited).toEqual([]);
        })

        it('can iterate top-down a node', () => {
            const visited: number[] = [];
            testTree.forEach(node => { visited.push(node.id) }, { parentId: 100 } );
            expect(visited).toEqual([100, 110, 120, 121, 122]);
        })

        it('can iterate bottom-up a node', () => {
            const visited: number[] = [];
            testTree.forEach(node => { visited.push(node.id) }, { parentId: 100, direction: 'bottom-up' });
            expect(visited).toEqual([110, 121, 122, 120, 100]);
        })

        it('can iterate top-down whole tree', () => {
            const visited: number[] = [];
            testTree.forEach(node => { visited.push(node.id) });
            expect(visited).toEqual([100, 110, 120, 121, 122, 200, 300, 310, 320, 330]);
        })

        it('can iterate bottom-up whole tree', () => {
            const visited: number[] = [];
            testTree.forEach(node => { visited.push(node.id) }, { direction: 'bottom-up' });
            expect(visited).toEqual([110, 121, 122, 120, 100, 200, 310, 320, 330, 300]);
        })
    })

    describe('computeSubtotals', () => {
        it('can calculate child counts', () => {
            const subtotals = testTree.computeSubtotals(_ => 1, (a, b) => a + b);
            expect(subtotals.get(100)).toBe(5);
            expect(subtotals.get(120)).toBe(3);
            expect(subtotals.get(121)).toBe(1);
            expect(subtotals.get(200)).toBe(1);
            expect(subtotals.get(300)).toBe(4);
            expect(subtotals.get(undefined)).toBe(10);
        })

        it('can sum values', () => {
            const subtotals = testTree.computeSubtotals(item => item.value || 0, (a, b) => a + b);
            expect(subtotals.get(100)).toBe(13);
            expect(subtotals.get(120)).toBe(9);
            expect(subtotals.get(121)).toBe(3);
            expect(subtotals.get(200)).toBe(5);
            expect(subtotals.get(300)).toBe(6);
            expect(subtotals.get(undefined)).toBe(24);
        })

        it('can sum values (children only)', () => {
            const subtotals = testTree.computeSubtotals(
                (item, hasChildren) => hasChildren ? 0 : (item.value || 0),
                (a, b) => a + b
            );
            expect(subtotals.get(100)).toBe(8);
            expect(subtotals.get(120)).toBe(7);
            expect(subtotals.get(121)).toBe(3);
            expect(subtotals.get(200)).toBe(5);
            expect(subtotals.get(300)).toBe(6);
            expect(subtotals.get(undefined)).toBe(19);
        })
    });
});
import { Tree } from "../Tree";

interface TestItem {
    id: number;
    parentId?: number;
    name?: string;
}

const testData: TestItem[] = [
    { id: 100 }, //  0   100
    { id: 110, parentId: 100 }, //  1   110
    { id: 120, parentId: 100 }, //  2     120
    { id: 121, parentId: 120 }, //  3       121
    { id: 122, parentId: 120 }, //  4       122
    { id: 200 }, //  5   200
    { id: 300 }, //  6   300
    { id: 310, parentId: 300 }, //  7     310
    { id: 320, parentId: 300 }, //  8     320
    { id: 330, parentId: 300 }, //  9     330
];

const testTree = Tree.create({ getId: i => i.id, getParentId: i => i.parentId }, testData);

describe('Tree', () => {
    it('can get items by id', () => {
        expect(testTree.getById(100)).toBe(testData[0]);
    })

    it('can get children by parent Id', () => {
        const nodes = testTree.getNodesByParentId(100);
        expect(nodes).toEqual([
            { id: 110, key: '110', parentId: 100, index: 0, item: { id: 110, parentId: 100 } },
            { id: 120, key: '120', parentId: 100, index: 1, item: { id: 120, parentId: 100 } },
        ]);
    })

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
});
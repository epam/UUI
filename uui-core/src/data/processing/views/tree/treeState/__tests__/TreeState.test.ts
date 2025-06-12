import { TreeState } from '../TreeState';
import { ItemsMap } from '../../ItemsMap';
import type { ITreeParams } from '../../treeStructure';
import { NOT_FOUND_RECORD } from '../../constants';

interface TestItem {
    id: string;
    parentId?: string;
    alternateParentId?: string;
    name: string;
}

describe('TreeState', () => {
    const testItems: TestItem[] = [
        { id: 'root', parentId: undefined, alternateParentId: undefined, name: 'Root' },
        { id: 'child1', parentId: 'root', alternateParentId: 'child2', name: 'Child 1' },
        { id: 'child2', parentId: 'root', alternateParentId: undefined, name: 'Child 2' },
    ];

    const getId = (item: TestItem) => item.id;
    const getParentId = (item: TestItem) => item.parentId;
    const getAlternateParentId = (item: TestItem) => item.alternateParentId;

    const itemsMap = new ItemsMap(new Map(), { getId, complexIds: false });
    const itemsMapWithData = itemsMap.setItems(testItems);

    const setItems = jest.fn();

    beforeEach(() => {
        setItems.mockClear();
    });

    describe('clearStructure', () => {
        it('should use original params when no new params provided', () => {
            const originalParams: ITreeParams<TestItem, string> = {
                getId,
                getParentId,
                complexIds: false,
            };

            const treeState = TreeState.blank(originalParams, itemsMapWithData, setItems);
            const clearedTreeState = treeState.clearStructure();

            // Should use original getParentId
            expect(clearedTreeState.visible!.getParams().getParentId).toBe(getParentId);
            expect(clearedTreeState.full!.getParams().getParentId).toBe(getParentId);
        });

        it('should use new params when provided', () => {
            const originalParams: ITreeParams<TestItem, string> = {
                getId,
                getParentId,
                complexIds: false,
            };

            const newParams: ITreeParams<TestItem, string> = {
                getId,
                getParentId: getAlternateParentId,
                complexIds: false,
            };

            const treeState = TreeState.blank(originalParams, itemsMapWithData, setItems);
            const clearedTreeState = treeState.clearStructure(newParams);

            // Should use new getParentId
            expect(clearedTreeState.visible!.getParams().getParentId).toBe(getAlternateParentId);
            expect(clearedTreeState.full!.getParams().getParentId).toBe(getParentId); // full tree should remain unchanged
        });

        it('should preserve itemsMap and setItems', () => {
            const originalParams: ITreeParams<TestItem, string> = {
                getId,
                getParentId,
                complexIds: false,
            };

            const newParams: ITreeParams<TestItem, string> = {
                getId,
                getParentId: getAlternateParentId,
                complexIds: false,
            };

            const treeState = TreeState.blank(originalParams, itemsMapWithData, setItems);
            const clearedTreeState = treeState.clearStructure(newParams);

            // ItemsMap should be preserved
            expect(clearedTreeState.itemsMap).toBe(itemsMapWithData);
            expect(clearedTreeState.setItems).toBe(setItems);

            // Should be able to access items
            expect(clearedTreeState.getById('root')).toEqual(testItems[0]);
            expect(clearedTreeState.getById('child1')).toEqual(testItems[1]);
            expect(clearedTreeState.getById('nonexistent')).toBe(NOT_FOUND_RECORD);
        });

        it('should clear visible tree structure but keep full tree', () => {
            const originalParams: ITreeParams<TestItem, string> = {
                getId,
                getParentId,
                complexIds: false,
            };

            // Create a tree with some structure
            const treeState = TreeState.createFromItems(testItems, undefined, originalParams, setItems);

            // Verify initial structure exists
            const initialRootItems = treeState.visible!.getItems(undefined);
            expect(initialRootItems.ids.length).toBeGreaterThan(0);

            const newParams: ITreeParams<TestItem, string> = {
                getId,
                getParentId: getAlternateParentId,
                complexIds: false,
            };

            // Clear structure with new params
            const clearedTreeState = treeState.clearStructure(newParams);

            // Visible tree should be cleared
            const clearedRootItems = clearedTreeState.visible!.getItems(undefined);
            expect(clearedRootItems.ids).toEqual([]);

            // But items should still be accessible
            expect(clearedTreeState.getById('root')).toEqual(testItems[0]);
        });

        it('should work with different getParentId logic affecting hierarchy', () => {
            // Setup original tree with normal parentId logic
            const originalParams: ITreeParams<TestItem, string> = {
                getId,
                getParentId: (item) => item.parentId,
                complexIds: false,
            };

            const treeState = TreeState.createFromItems(testItems, undefined, originalParams, setItems);

            // child1 should be under root originally
            const originalChild1Item = treeState.getById('child1');
            expect(originalChild1Item).not.toBe(NOT_FOUND_RECORD);

            const originalChild1Parent = originalParams.getParentId!(originalChild1Item as TestItem);
            expect(originalChild1Parent).toBe('root');

            // Clear with alternate parentId logic
            const newParams: ITreeParams<TestItem, string> = {
                getId,
                getParentId: (item) => item.alternateParentId,
                complexIds: false,
            };

            const clearedTreeState = treeState.clearStructure(newParams);

            // With new logic, child1 should have child2 as parent
            const newChild1Item = clearedTreeState.getById('child1');
            expect(newChild1Item).not.toBe(NOT_FOUND_RECORD);

            const newChild1Parent = newParams.getParentId!(newChild1Item as TestItem);
            expect(newChild1Parent).toBe('child2');
        });
    });
});

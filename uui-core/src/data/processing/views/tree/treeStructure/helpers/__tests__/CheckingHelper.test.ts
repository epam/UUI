import { CheckingHelper } from '../CheckingHelper';
import { TreeStructure } from '../../TreeStructure';
import { Tree } from '../../../Tree';
import { ItemsMap } from '../../../ItemsMap';
import { ItemsAccessor } from '../../../ItemsAccessor';
import { ITreeParams } from '../../types';

interface TestItem {
    id: number;
    parentId?: number;
}

const params: ITreeParams<TestItem, number> = {
    getId: (i) => i.id,
    getParentId: (i) => i.parentId,
};

// count === undefined: the tree has never been loaded (PARTIALLY_LOADED).
const notLoadedTree = () => TreeStructure.create(params, ItemsAccessor.toItemsAccessor(ItemsMap.blank(params)));

// count === 0: the tree is loaded, but the (initial) response was empty (EMPTY).
const emptyLoadedTree = () => Tree.createFromItems({ params, items: [] });

const check = (
    tree: ReturnType<typeof notLoadedTree>,
    overrides: Partial<Parameters<typeof CheckingHelper.cascadeSelection<TestItem, number>>[0]>,
) =>
    CheckingHelper.cascadeSelection<TestItem, number>({
        tree,
        currentCheckedIds: [],
        checkedId: 1,
        isChecked: true,
        isCheckable: () => true,
        isUnknown: () => false,
        cascadeSelectionType: false,
        ...overrides,
    });

describe('CheckingHelper.cascadeSelection', () => {
    describe('item selection in LazyDataSource (tree not loaded yet, count === undefined)', () => {
        it('applies the check even when the complete tree is not loaded (simple selection)', () => {
            const tree = notLoadedTree();
            expect(tree.getItems(undefined).count).toBeUndefined();

            expect(check(tree, { checkedId: 1, isChecked: true, cascadeSelectionType: false })).toEqual([1]);
        });

        it('applies the check even when the complete tree is not loaded (cascade selection)', () => {
            const tree = notLoadedTree();

            expect(check(tree, { checkedId: 1, isChecked: true, cascadeSelectionType: true })).toEqual([1]);
        });

        it('clears a tag when unchecking on a not-loaded tree (PickerInput tags before body is opened)', () => {
            const tree = notLoadedTree();

            expect(check(tree, { currentCheckedIds: [1, 2], checkedId: 1, isChecked: false })).toEqual([2]);
        });
    });

    describe('initial empty response (tree loaded but empty, count === 0)', () => {
        it('treats an empty response as loaded and applies the check', () => {
            const tree = emptyLoadedTree();
            expect(tree.getItems(undefined).count).toBe(0);

            expect(check(tree, { checkedId: 1, isChecked: true, cascadeSelectionType: false })).toEqual([1]);
        });

        it('treats an empty response as loaded and removes a previously checked id on uncheck', () => {
            const tree = emptyLoadedTree();

            expect(check(tree, { currentCheckedIds: [1, 2], checkedId: 1, isChecked: false })).toEqual([2]);
        });
    });
});

import { TreeStructure } from './TreeStructure';

/**
 * @internal
 */
export class ConvertableTreeStructure<TItem, TId> extends TreeStructure<TItem, TId> {
    public static toPureTreeStructure<TItem, TId>(treeStructure: TreeStructure<TItem, TId>) {
        return TreeStructure.toPureTreeStructure(treeStructure);
    }

    public static toManagableTreeStructure<TItem, TId>(treeStructure: ConvertableTreeStructure<TItem, TId>) {
        return TreeStructure.create(
            treeStructure.params,
            treeStructure.byParentId,
            treeStructure.nodeInfoById,
        );
    }
}

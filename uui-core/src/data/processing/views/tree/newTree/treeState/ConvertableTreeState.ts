import { TreeState } from './TreeState';
import { PureTreeState } from './PureTreeState';
import { ConvertableTreeStructure } from '../treeStructure';

export class ConvertableTreeState<TItem, TId> extends PureTreeState<TItem, TId> {
    public static toTreeState<TItem, TId>(treeState: ConvertableTreeState<TItem, TId>) {
        return TreeState.create(
            ConvertableTreeStructure.toTreeStructure(treeState._fullTree, treeState._itemsMap),
            ConvertableTreeStructure.toTreeStructure(treeState._visibleTree, treeState._itemsMap),
            treeState._itemsMap,
            treeState._setItems,
        );
    }

    public static toPureTreeState<TItem, TId>(treeState: TreeState<TItem, TId>) {
        return TreeState.toPureTreeState(treeState);
    }
}

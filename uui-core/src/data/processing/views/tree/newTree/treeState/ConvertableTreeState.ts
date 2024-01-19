import { TreeState } from './TreeState';
import { PureTreeState } from './PureTreeState';
import { ConvertableTreeStructure } from '../treeStructure/ConvertableTreeStructure';

export class ConvertableTreeState<TItem, TId> extends PureTreeState<TItem, TId> {
    public static toTreeState<TItem, TId>(treeState: ConvertableTreeState<TItem, TId>) {
        return TreeState.create(
            ConvertableTreeStructure.toTreeStructure(treeState.fullTree, treeState.itemsMap),
            ConvertableTreeStructure.toTreeStructure(treeState.visibleTree, treeState.itemsMap),
            treeState.itemsMap,
            treeState.setItems,
        );
    }

    public static toPureTreeState<TItem, TId>(treeState: TreeState<TItem, TId>) {
        return TreeState.toPureTreeState(treeState);
    }
}

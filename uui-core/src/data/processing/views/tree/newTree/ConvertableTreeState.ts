import { ItemsMap } from '../../../ItemsMap';
import { ItemsStorage } from '../../../ItemsStorage';
import { TreeState } from './TreeState';
import { TreeStructure } from './treeStructure/PureTreeStructure';

export class ConvertableTreeState<TItem, TId> extends TreeState<TItem, TId> {
    public static toManagableTreeState<TItem, TId>(treeState: ConvertableTreeState<TItem, TId>) {
        return;
    }

    public static create<TItem, TId>(
        fullTree: TreeStructure<TItem, TId>,
        visibleTree: TreeStructure<TItem, TId>,
        itemsMap: ItemsMap<TId, TItem>,
        setItems: ItemsStorage<TItem, TId>['setItems'],
    ) {
        return new TreeState(
            fullTree,
            visibleTree,
            itemsMap,
            setItems,
        );
    }
}

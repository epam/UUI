import { ItemsMap } from '../../../../../../data/processing/ItemsMap';
import { ItemsAccessor } from '../ItemsAccessor';
import { PureTreeStructure } from './PureTreeStructure';
import { TreeStructure } from './TreeStructure';

/**
 * @internal
 */
export class ConvertableTreeStructure<TItem, TId> extends PureTreeStructure<TItem, TId> {
    public static toPureTreeStructure<TItem, TId>(treeStructure: TreeStructure<TItem, TId>) {
        return TreeStructure.toPureTreeStructure(treeStructure);
    }

    public static toTreeStructure<TItem, TId>(
        treeStructure: ConvertableTreeStructure<TItem, TId>,
        itemsMap: ItemsMap<TId, TItem>,
    ) {
        return TreeStructure.create(
            treeStructure._params,
            ItemsAccessor.toItemsAccessor(itemsMap),
            treeStructure._byParentId,
            treeStructure._nodeInfoById,
        );
    }
}

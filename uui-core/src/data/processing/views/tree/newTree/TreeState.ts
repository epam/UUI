import { ItemsMap } from '../../../ItemsMap';
import { ItemsStorage } from '../../../ItemsStorage';
import { TreeStructure } from './treeStructure/PureTreeStructure';

export class TreeState<TItem, TId> {
    protected constructor(
        protected readonly fullTree: TreeStructure<TItem, TId>,
        protected readonly visibleTree: TreeStructure<TItem, TId>,
        protected readonly itemsMap: ItemsMap<TId, TItem>,
        protected readonly setItems: ItemsStorage<TItem, TId>['setItems'],
    ) {}

    public getById(id: TId) {
        return this.itemsMap.get(id);
    }
}

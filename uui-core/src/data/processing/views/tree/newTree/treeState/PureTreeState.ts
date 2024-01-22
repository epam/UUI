import { ItemsMap } from '../../ItemsMap';
import { ItemsStorage } from '../../ItemsStorage';
import { PureTreeStructure } from '../treeStructure';

export class PureTreeState<TItem, TId> {
    protected constructor(
        protected _fullTree: PureTreeStructure<TItem, TId> | null,
        protected _visibleTree: PureTreeStructure<TItem, TId> | null,
        protected _itemsMap: ItemsMap<TId, TItem>,
        protected _setItems: ItemsStorage<TItem, TId>['setItems'],
    ) {}

    get(id: TId) { // TODO: decide what to do with return type of getById.
        return this._itemsMap.get(id);
    }
}

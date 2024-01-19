import { ItemsMap } from '../../../ItemsMap';
import { ItemsStorage } from '../../../ItemsStorage';
import { ConvertableTreeStructure } from './treeStructure/ConvertableTreeStructure';
import { ITreeStructure } from './treeStructure/ITreeStructure';
import { PureTreeStructure } from './treeStructure/PureTreeStructure';

export class TreeState<TItem, TId> {
    protected constructor(
        protected readonly _fullTree: ITreeStructure<TItem, TId>,
        protected readonly _visibleTree: ITreeStructure<TItem, TId>,
        protected readonly _itemsMap: ItemsMap<TId, TItem>,
        protected readonly _setItems: ItemsStorage<TItem, TId>['setItems'],
    ) {}

    public getById(id: TId) {
        return this._itemsMap.get(id);
    }

    public static create<TItem, TId>(
        fullTree: PureTreeStructure<TItem, TId>,
        visibleTree: PureTreeStructure<TItem, TId>,
        itemsMap: ItemsMap<TId, TItem>,
        setItems: ItemsStorage<TItem, TId>['setItems'],
    ) {
        return new TreeState(
            ConvertableTreeStructure.toTreeStructure(fullTree, itemsMap),
            ConvertableTreeStructure.toTreeStructure(visibleTree, itemsMap),
            itemsMap,
            setItems,
        );
    }
}

import { ItemsMap } from '../../ItemsMap';
import { ItemsStorage } from '../../ItemsStorage';
import { PureTreeStructure } from '../treeStructure';

export class PureTreeState<TItem, TId> {
    protected constructor(
        protected fullTree: PureTreeStructure<TItem, TId> | null,
        protected visibleTree: PureTreeStructure<TItem, TId> | null,
        protected itemsMap: ItemsMap<TId, TItem>,
        protected setItems: ItemsStorage<TItem, TId>['setItems'],
    ) {}
}

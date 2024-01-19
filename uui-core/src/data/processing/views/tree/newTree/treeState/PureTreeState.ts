import { ItemsStorage } from '../../../../../../data/processing/ItemsStorage';
import { ItemsMap } from '../../../../../../data/processing/ItemsMap';
import { PureTreeStructure } from '../treeStructure/PureTreeStructure';

export class PureTreeState<TItem, TId> {
    protected constructor(
        protected fullTree: PureTreeStructure<TItem, TId> | null,
        protected visibleTree: PureTreeStructure<TItem, TId> | null,
        protected itemsMap: ItemsMap<TId, TItem>,
        protected setItems: ItemsStorage<TItem, TId>['setItems'],
    ) {}
}

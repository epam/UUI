import { IMap } from '../../../../../../types';
import { NOT_FOUND_RECORD, TreeNodeInfo, TreeParams } from '../../ITree';
import { newMap } from '../../BaseTree';

export interface TreeStructureParams<TItem, TId> extends TreeParams<TItem, TId> {
    getById(id: TId): TItem | typeof NOT_FOUND_RECORD;
}

export class PureTreeStructure<TItem, TId> {
    protected constructor(
        protected _params: TreeStructureParams<TItem, TId>,
        protected readonly _byParentId?: IMap<TId, TId[]>,
        protected readonly _nodeInfoById?: IMap<TId, TreeNodeInfo>,
        protected readonly getById?: (id: TId) => TItem,
    ) {
        this._byParentId = _byParentId ?? newMap(_params);
        this._nodeInfoById = _nodeInfoById ?? newMap(_params);
    }
}

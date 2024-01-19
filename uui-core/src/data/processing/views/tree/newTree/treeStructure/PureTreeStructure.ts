import { IMap } from '../../../../../../types';
import { TreeNodeInfo, TreeParams } from '../../ITree';
import { newMap } from '../../BaseTree';

export class PureTreeStructure<TItem, TId> {
    protected constructor(
        protected _params: TreeParams<TItem, TId>,
        protected readonly _byParentId?: IMap<TId, TId[]>,
        protected readonly _nodeInfoById?: IMap<TId, TreeNodeInfo>,
    ) {
        this._byParentId = _byParentId ?? newMap(_params);
        this._nodeInfoById = _nodeInfoById ?? newMap(_params);
    }
}

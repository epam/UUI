import { IMap } from '../../../../../../types';
import { TreeNodeInfo, TreeParams } from './ITreeStructure';
import { newMap } from './helpers';

class PureTreeStructure<TItem, TId> {
    protected constructor(
        protected _params: TreeParams<TItem, TId>,
        protected readonly _byParentId: IMap<TId, TId[]> = newMap(_params),
        protected readonly _nodeInfoById: IMap<TId, TreeNodeInfo> = newMap(_params),
    ) {}
}

export { PureTreeStructure };

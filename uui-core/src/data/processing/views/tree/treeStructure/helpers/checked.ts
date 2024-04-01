import { DataSourceState, IImmutableMap, IMap } from '../../../../../../types';
import { ITree } from '../../ITree';
import { NOT_FOUND_RECORD } from '../../constants';

export const getSelectedAndChecked = <TItem, TId>(
    dataSourceState: DataSourceState<any, TId>,
    tree: ITree<TItem, TId>,
    patch: IMap<TId, TItem> | IImmutableMap<TId, TItem>,
) => {
    let checked: TId[] = [];
    if (dataSourceState.checked?.length) {
        checked = [...dataSourceState.checked];
    }
    if (dataSourceState.selectedId !== null && dataSourceState.selectedId !== undefined) {
        checked = [...checked, dataSourceState.selectedId];
    }

    if (!patch || !patch.size) {
        return checked;
    }

    return checked.filter((id) => !patch.has(id) || (patch.has(id) && tree.getById(id) !== NOT_FOUND_RECORD));
};

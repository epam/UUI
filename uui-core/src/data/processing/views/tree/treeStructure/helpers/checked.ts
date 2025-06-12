import type { DataSourceState, IImmutableMap, IMap } from '../../../../../../types';

export const getSelectedAndChecked = <TItem, TId>(
    dataSourceState: DataSourceState<any, TId>,
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

    return checked.filter((id) => !patch.has(id));
};

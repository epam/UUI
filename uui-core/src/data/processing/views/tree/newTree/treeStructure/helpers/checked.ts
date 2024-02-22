import { DataSourceState } from '../../../../../../../types';

export const getSelectedAndChecked = <TId>(dataSourceState: DataSourceState<any, TId>) => {
    let checked: TId[] = [];
    if (dataSourceState.checked?.length) {
        checked = [...dataSourceState.checked];
    }
    if (dataSourceState.selectedId !== null && dataSourceState.selectedId !== undefined) {
        checked = [...checked, dataSourceState.selectedId];
    }

    return checked;
};

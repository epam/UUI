import isEqual from 'lodash.isequal';
import { DataSourceState } from '../../../../../../types';

export const isSelectedOrCheckedChanged = (dataSourceState: DataSourceState, prevDataSourceState: DataSourceState) => {
    return (
        dataSourceState.checked?.length && !isEqual(prevDataSourceState?.checked, dataSourceState.checked)
    ) || (dataSourceState.selectedId !== null
        && dataSourceState.selectedId !== undefined
        && dataSourceState.selectedId !== prevDataSourceState?.selectedId);
};

export const getChecked = (dataSourceState: DataSourceState) => {
    if (dataSourceState.checked !== null) {
        return dataSourceState.checked;
    }

    if (dataSourceState.selectedId !== null && dataSourceState.selectedId !== undefined) {
        return [dataSourceState.selectedId];
    }
    return [];
};

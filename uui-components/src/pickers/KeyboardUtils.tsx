import { DataSourceState, DataRowProps, IEditable, IDataSourceView } from '@epam/uui-core';
import { PickerInputEditMode, PickerInputSearchPosition } from './hooks/types';

export interface DataSourceKeyboardParams extends IEditable<DataSourceState> {
    listView: IDataSourceView<any, any, any>;
    rows: DataRowProps<any, any>[];
    editMode?: PickerInputEditMode;
    searchPosition?: PickerInputSearchPosition;
}

export const handleDataSourceKeyboard = (params: DataSourceKeyboardParams, e: React.KeyboardEvent<HTMLElement>) => {
    const value = params.value;
    let search = value.search;

    let focusedIndex = value.focusedIndex || 0;
    const maxVisibleIndex = value.topIndex + params.rows.length - 1;

    switch (e.key) {
        case 'Backspace': {
            const selectedRows = params.listView.getSelectedRows();
            if (params.searchPosition === 'input' && !value.search && value.checked && selectedRows.length > 0) {
                const lastSelection = selectedRows[selectedRows.length - 1];
                lastSelection.onCheck(lastSelection);
            }
            break;
        }
        case 'Enter': {
            if (value.topIndex <= focusedIndex && focusedIndex <= maxVisibleIndex) {
                const focusedRow: DataRowProps<any, any> = params.rows[value.focusedIndex - value.topIndex];
                const clickHandler = focusedRow.onFold || focusedRow.onSelect || focusedRow.onCheck;
                clickHandler && clickHandler(focusedRow);
                if (!focusedRow.onFold && search) {
                    search = '';
                    focusedIndex = 0;
                }
            }
            break;
        }
        case 'ArrowUp': {
            e.preventDefault();
            if (focusedIndex > maxVisibleIndex) {
                focusedIndex = maxVisibleIndex;
            } else if (focusedIndex > 0) {
                focusedIndex--;
            }
            break;
        }
        case 'ArrowDown': {
            e.preventDefault();
            if (focusedIndex < value.topIndex) {
                focusedIndex = value.topIndex;
            } else if (focusedIndex < maxVisibleIndex) {
                focusedIndex++;
            }
            break;
        }
        default:
            return;
    }

    if (value.focusedIndex !== focusedIndex || value.search !== search) {
        params.onValueChange({
            ...value,
            focusedIndex,
            search,
        });
    }
};

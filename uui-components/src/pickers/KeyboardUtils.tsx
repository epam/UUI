import {DataSourceState, DataRowProps, IEditable, IDataSourceView } from "@epam/uui";

export interface DataSourceKeyboardParams extends IEditable<DataSourceState> {
    listView: IDataSourceView<any, any, any>;
    rows: DataRowProps<any, any>[];
    editMode?: 'dropdown' | 'modal';
}

export const handleDataSourceKeyboard = (params: DataSourceKeyboardParams, e: React.KeyboardEvent<HTMLElement>) => {
    const value = params.value;
    let search = value.search;
    const selectedRows = params.listView.getSelectedRows();

    let focusedIndex = value.focusedIndex || 0;
    let maxVisibleIndex = value.topIndex + params.rows.length - 1;

    switch (e.key) {
        case 'Backspace': {
            if (params.editMode !== 'modal' && !value.search && value.checked && selectedRows.length > 0) {
                let lastSelection = selectedRows[selectedRows.length - 1];
                lastSelection.onCheck(lastSelection);
            }
            break;
        }
        case 'Enter': {
            if (value.topIndex <= focusedIndex && focusedIndex <= maxVisibleIndex) {
                let focusedRow: DataRowProps<any, any> = params.rows[value.focusedIndex - value.topIndex];
                let clickHandler = focusedRow.onFold || focusedRow.onSelect || focusedRow.onCheck;
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
        default: return;
    }

    if (value.focusedIndex != focusedIndex || value.search != search) {
        params.onValueChange({
            ...value,
            focusedIndex,
            search,
        });
    }
};
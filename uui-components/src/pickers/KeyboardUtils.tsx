import React from 'react';
import { DataSourceState, DataRowProps, IDataSourceView, PickerInputSearchPosition } from '@epam/uui-core';

interface DataSourceKeyboardParams {
    value: DataSourceState;
    onValueChange: (setter: ((prevState: DataSourceState) => DataSourceState)) => void;
    listView: IDataSourceView<any, any, any>;
    rows: DataRowProps<any, any>[];
    searchPosition: PickerInputSearchPosition;
}

export const handleDataSourceKeyboard = (params: DataSourceKeyboardParams, e: React.KeyboardEvent) => {
    const value = params.value;

    let focusedIndex = value.focusedIndex || 0;
    const maxVisibleIndex = value.topIndex + params.rows.length - 1;

    switch (e.key) {
        case 'Backspace': {
            if (params.searchPosition === 'input' && !value.search && value.checked && value.checked.length > 0) {
                const lastSelectionId = value.checked[value.checked.length - 1];
                const lastSelection = params.listView.getById(lastSelectionId, null);
                if (lastSelection.isCheckable) {
                    lastSelection.onCheck(lastSelection);
                }
            }
            break;
        }
        case 'Enter': {
            if (value.topIndex <= focusedIndex && focusedIndex <= maxVisibleIndex) {
                const focusedRow: DataRowProps<any, any> = params.rows[value.focusedIndex - value.topIndex];
                const clickHandler = focusedRow.onSelect || focusedRow.onCheck;
                clickHandler && clickHandler(focusedRow);
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
        case 'ArrowLeft': {
            e.preventDefault();
            const focusedRow: DataRowProps<any, any> = params.rows[value.focusedIndex - value.topIndex];
            if (focusedRow.isFolded) break;
            const clickHandler = focusedRow.onFold;
            clickHandler && clickHandler(focusedRow);
            break;
        }
        case 'ArrowRight': {
            e.preventDefault();
            const focusedRow: DataRowProps<any, any> = params.rows[value.focusedIndex - value.topIndex];
            if (!focusedRow.isFolded) break;
            const clickHandler = focusedRow.onFold;
            clickHandler && clickHandler(focusedRow);
            break;
        }
        default:
            return;
    }

    if (value.focusedIndex !== focusedIndex) {
        params.onValueChange((state) => ({
            ...state,
            focusedIndex,
            scrollTo: { index: focusedIndex, behavior: 'smooth', align: 'nearest' },
        }));
    }
};

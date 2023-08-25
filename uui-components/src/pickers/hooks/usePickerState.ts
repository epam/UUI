import { useState } from 'react';
import { DataSourceState } from '@epam/uui-core';
import { PickerState, UsePickerStateProps } from './types';

export function usePickerState(props: UsePickerStateProps): PickerState {
    const [dataSourceState, setDataSourceState] = useState<DataSourceState>({
        focusedIndex: 0,
        topIndex: 0,
        visibleCount: 20,
        ...props.dataSourceState,
    });

    const [showSelected, setShowSelected] = useState<boolean>(false);

    return {
        dataSourceState,
        setDataSourceState,
        showSelected,
        setShowSelected,
    };
}

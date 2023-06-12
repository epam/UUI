import { Dispatch, SetStateAction, useState } from 'react';
import { DataSourceState } from '@epam/uui-core';

export interface UsePickerStateProps {
    dataSourceState?: Partial<DataSourceState>;
}

export interface PickerState {
    dataSourceState: DataSourceState;
    setDataSourceState: Dispatch<SetStateAction<DataSourceState>>;
    showSelected: boolean;
    setShowSelected: Dispatch<SetStateAction<boolean>>;
}

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

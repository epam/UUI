import { useState } from 'react';
import { usePickerState } from './usePickerState';
import { PickerListState, UsePickerListStateProps } from './types';

export function usePickerListState<TId>(props: UsePickerListStateProps<TId>): PickerListState<TId> {
    const pickerState = usePickerState(props);
    const [visibleIds, setVisibleIds] = useState<TId[]>(props.visibleIds ?? []);
    return {
        ...pickerState,
        visibleIds,
        setVisibleIds,
    };
}

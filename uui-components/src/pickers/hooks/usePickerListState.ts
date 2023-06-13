import { Dispatch, SetStateAction, useState } from 'react';
import { PickerState, UsePickerStateProps, usePickerState } from './usePickerState';

export interface UsePickerListStateProps<TId> extends UsePickerStateProps {
    visibleIds?: TId[];
}

export interface PickerListState<TId> extends PickerState {
    visibleIds: TId[];
    setVisibleIds: Dispatch<SetStateAction<TId[]>>;
}

export function usePickerListState<TId>(props: UsePickerListStateProps<TId>): PickerListState<TId> {
    const pickerState = usePickerState(props);
    const [visibleIds, setVisibleIds] = useState<TId[]>(props.visibleIds ?? []);
    return {
        ...pickerState,
        visibleIds,
        setVisibleIds,
    };
}

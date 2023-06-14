import { Dispatch, SetStateAction, useState } from 'react';
import { PickerState, UsePickerStateProps, usePickerState } from './usePickerState';

export interface UsePickerModalStateProps<TItem, TId> extends UsePickerStateProps {
    selection: TItem | TId | TId[] | TItem[];
}

export interface PickerModalState<TItem, TId> extends PickerState {
    selection: TItem | TId | TId[] | TItem[];
    setSelection: Dispatch<SetStateAction<TItem | TId | TId[] | TItem[]>>;
}

export function usePickerModalState<TItem, TId>(props: UsePickerModalStateProps<TItem, TId>): PickerModalState<TItem, TId> {
    const pickerState = usePickerState(props);
    const [selection, setSelection] = useState(props.selection ?? []);
    return {
        ...pickerState,
        selection,
        setSelection,
    };
}

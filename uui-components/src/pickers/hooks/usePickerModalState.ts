import { useState } from 'react';
import { usePickerState } from './usePickerState';
import { PickerModalState, UsePickerModalStateProps } from './types';

export function usePickerModalState<TItem, TId>(props: UsePickerModalStateProps<TItem, TId>): PickerModalState<TItem, TId> {
    const pickerState = usePickerState(props);
    const [selection, setSelection] = useState(props.selection ?? []);
    return {
        ...pickerState,
        selection,
        setSelection,
    };
}

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { usePickerState } from './usePickerState';
import { PickerState, UsePickerStateProps } from './types';

interface PickerModalState<TItem, TId> extends PickerState {
    selection: TItem | TId | TId[] | TItem[];
    setSelection: Dispatch<SetStateAction<TItem | TId | TId[] | TItem[]>>;
}

interface UsePickerModalStateProps<TItem, TId> extends UsePickerStateProps {
    selection: TItem | TId | TId[] | TItem[];
    selectionMode: 'single' | 'multi';
}

export function usePickerModalState<TItem, TId>(props: UsePickerModalStateProps<TItem, TId>): PickerModalState<TItem, TId> {
    const pickerState = usePickerState(props);
    const { selectionMode } = props;
    const [selection, setSelection] = useState<UsePickerModalStateProps<TItem, TId>['selection']>(props.selection);

    useEffect(() => {
        if (props.selection !== selection) {
            setSelection(props.selection);
        }
    }, [props.selection]);

    useEffect(() => {
        if (selection === undefined && selectionMode !== 'single') {
            setSelection([]);
        }
    }, [selection]);
    return {
        ...pickerState,
        setSelection,
        selection,
    };
}

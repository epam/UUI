import { useEffect, useState } from 'react';
import { usePickerState } from './usePickerState';
import { PickerModalState, UsePickerModalStateProps } from './types';

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

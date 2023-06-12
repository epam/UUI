import { Dispatch, SetStateAction, useState } from 'react';
import { PickerState, UsePickerStateProps, usePickerState } from './usePickerState';

export interface UsePickerInputStateProps extends UsePickerStateProps {}

export interface PickerInputState extends PickerState {
    opened: boolean;
    setOpened: Dispatch<SetStateAction<boolean>>;
    isSearchChanged: boolean;
    setIsSearchChanged: Dispatch<SetStateAction<boolean>>;
}

export function usePickerInputState(props: UsePickerInputStateProps): PickerInputState {
    const pickerState = usePickerState(props);
    const [opened, setOpened] = useState<boolean>(false);
    const [isSearchChanged, setIsSearchChanged] = useState<boolean>(false);
    return {
        ...pickerState,
        opened,
        setOpened,
        isSearchChanged,
        setIsSearchChanged,
    };
}

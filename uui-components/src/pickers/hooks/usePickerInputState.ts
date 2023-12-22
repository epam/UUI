import { useState } from 'react';
import { usePickerState } from './usePickerState';
import { PickerInputState, UsePickerInputStateProps } from './types';

export function usePickerInputState(props: UsePickerInputStateProps): PickerInputState {
    const pickerState = usePickerState(props);
    const [opened, setOpened] = useState<boolean>(false);
    const [isSearchChanged, setIsSearchChanged] = useState<boolean>(false);
    const [activateView, setActivateView] = useState(false);
    return {
        ...pickerState,
        opened,
        setOpened,
        isSearchChanged,
        setIsSearchChanged,
        activateView,
        setActivateView,
    };
}

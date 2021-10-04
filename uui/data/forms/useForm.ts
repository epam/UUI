import { useRef, useState } from 'react';
import { LensBuilder } from '../lenses/LensBuilder';
import { FormComponentState, FormProps, FormSaveResponse, RenderFormProps } from './Form';

type UseFormProps<T> = Omit<FormProps<T>, 'renderForm' | 'prevProps'>;

export function useForm<T>(props: UseFormProps<T>): RenderFormProps<T> {
    const initialForm = useRef<FormComponentState<T>>({
        isChanged: false,
        isInProgress: false,
        form: props.value,
        validationState: { isInvalid: false },
        serverValidationState: { isInvalid: false },
        formHistory: [props.value],
        historyIndex: 0
    });

    const lens = useRef(new LensBuilder<T, T>({
        get: () => formState.form,
        set: (big: T, small: T) => {
            handleFormUpdate(small);
            return small;
        },
        getValidationState: getMergedValidationState,
        getMetadata: (big: T) => props.getMetadata ? props.getMetadata(formState.form) : {},
    }));

    const [formState, setFormState] = useState<FormComponentState<T>>(initialForm.current);

    return {
        isChanged: formState.isChanged,
        lens: lens.current,
        save: handleSave,
        undo: handleUndo,
        redo: handleRedo,
        revert: handleRevert,
        validate,
        canUndo: formState.historyIndex !== 0,
        canRedo: formState.historyIndex !== formState.formHistory.length - 1,
        canRevert: formState.form !== props.value,
        value: formState.form,
        onValueChange: handleValueChange,
        isInvalid: formState.validationState.isInvalid,
        isInProgress: formState.isInProgress,
    };
}
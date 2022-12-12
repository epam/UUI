import { useRef, useEffect, useMemo, useCallback } from 'react';
import { mergeValidation, useForceUpdate, UuiContexts, validate as uuiValidate,
    validateServerErrorState, ICanBeInvalid } from '../../index';
import { useUuiContext } from '../../';
import { LensBuilder } from '../lenses/LensBuilder';
import isEqual from 'lodash.isequal';
import { FormProps, FormSaveResponse, IFormApi } from './Form';
import { useLock } from './useLock';

export interface FormState<T> {
    form: T;
    validationState: ICanBeInvalid;
    serverValidationState: ICanBeInvalid;
    lastSentForm?: T;
    isChanged: boolean;
    formHistory: T[];
    historyIndex: number;
    isInProgress: boolean;
    isInSaveMode: boolean;
}

interface ICanBeChanged {
    isChanged: boolean;
    changedProps?: ICanBeChanged;
}

export type UseFormProps<T> = Omit<FormProps<T>, 'renderForm'>;

export function useForm<T>(props: UseFormProps<T>): IFormApi<T> {
    const context: UuiContexts = useUuiContext();

    const initialForm = useRef<FormState<T>>({
        isChanged: false,
        isInProgress: false,
        form: props.value,
        validationState: { isInvalid: false },
        serverValidationState: { isInvalid: false },
        formHistory: [props.value],
        historyIndex: 0,
        isInSaveMode: false,
    });

    const prevFormValue = useRef<T>(props.value);

    const formState = useRef(initialForm.current);

    const forceUpdate = useForceUpdate();

    const updateFormState = (update: (current: FormState<T>) => FormState<T>) => {
        const newState = update(formState.current);
        formState.current = newState;
        forceUpdate();
    };

    const handleLeave = props.beforeLeave ? () => props.beforeLeave().then(res => {
        if (res) return handleSave(true);
        removeUnsavedChanges();
    }) : null;

    const lock = useLock({ isEnabled: formState.current.isChanged, handleLeave });

    const lens = useMemo(() => new LensBuilder<T, T>({
        get: () => formState.current.form,
        set: (_, small: T) => {
            handleFormUpdate(() => small);
            return small;
        },
        getValidationState: () => {
            const { form, lastSentForm, serverValidationState, validationState } = formState.current;
            const serverValidation = validateServerErrorState(form, lastSentForm, serverValidationState);
            return mergeValidation(validationState, serverValidation);
        },
        getMetadata: () => props.getMetadata ? props.getMetadata(formState.current.form) : {},
    }), [props.getMetadata]);

    useEffect(() => {
        const unsavedChanges = getUnsavedChanges();
        if (!unsavedChanges || !props.loadUnsavedChanges) return;
        props.loadUnsavedChanges().then(() => handleFormUpdate(() => unsavedChanges));
    }, []);

    useEffect(() => {
        if (!isEqual(props.value, prevFormValue.current)) {
            resetForm({
                ...formState.current,
                form: props.value,
                formHistory: formState.current.isChanged ? formState.current.formHistory : [props.value],
            });
            prevFormValue.current = props.value;
        }
    }, [props.value]);

    const removeUnsavedChanges = () => {
        context.uuiUserSettings.set(props.settingsKey, null);
    };

    const getUnsavedChanges = (): T => {
        return context.uuiUserSettings.get<T>(props.settingsKey);
    };
    //
    // const getChangedState = (newVal: T, initialVal: T): ICanBeChanged => {
    //     const getValueChangedState = (value: any, initialVal: any): ICanBeChanged => {
    //         const result: any = {};
    //         Object.keys(value).map(key => {
    //             const itemValue = value[key];
    //             const initialItemValue = initialVal && initialVal[key];
    //             const isChanged = itemValue !== initialItemValue;
    //             result[key] = {
    //                 isChanged,
    //             };
    //             if (itemValue && typeof itemValue === 'object') {
    //                 result[key].changedProps = getValueChangedState(value[key], initialItemValue);
    //             }
    //         });
    //         return result;
    //     };
    //     return getValueChangedState(newVal, initialVal);
    // };

    const handleFormUpdate = (update: (current: T) => T, options?: { addCheckpoint?: boolean }) => updateFormState(currentState => {
        options = options ?? {};
        options.addCheckpoint = options.addCheckpoint ?? true;

        const newForm = update(currentState.form);
        let { historyIndex, formHistory, isChanged } = currentState;
        if (options.addCheckpoint) {
            historyIndex++;
            isChanged = !isEqual(props.value, newForm);
        }
        formHistory = formHistory.slice(0, historyIndex).concat(newForm);

        if (options.addCheckpoint || context.uuiUserSettings.get(props.settingsKey)) {
            context.uuiUserSettings.set(props.settingsKey, newForm);
        }

        let newState = {
            ...currentState,
            form: newForm,
            isChanged,
            historyIndex,
            formHistory,
        };

        if (currentState.isInSaveMode || props.validationOn === "change") {
            newState = updateValidationStates(newState);
        }

        return newState;
    });

    const resetForm = (withNewState: FormState<T>) => updateFormState(currentState => {
        const newFormState = { ...currentState, ...withNewState };
        if (newFormState !== currentState) {
            initialForm.current = newFormState;
            return newFormState;
        }
    });

    const updateValidationStates = (state: FormState<T>) => {
        const valueToValidate = state.form;
        const metadata = props.getMetadata ? props.getMetadata(valueToValidate) : {};
        const isInSaveMode = state.isInSaveMode;
        const validationMode = isInSaveMode || !props.validationOn ? "save" : props.validationOn;
        const validationState = uuiValidate(valueToValidate, metadata, initialForm.current.form, validationMode);

        const newState = { ...state, validationState };

        if (!validationState.isInvalid) { // When form became valid, we switch inSaveMode to false
            newState.isInSaveMode = false;
        }
        return newState;
    };

    const handleSave = useCallback((isSavedBeforeLeave?: boolean) => {
        let savePromise: any;
        updateFormState(currentState => {
            let newState = { ...currentState, isInSaveMode: true };
            newState.isInSaveMode = true;
            newState = updateValidationStates(newState);
            if (!newState.validationState.isInvalid) {
                newState.isInProgress = true;
                savePromise = props.onSave(formState.current.form)
                    .then((response) => handleSaveResponse(response, isSavedBeforeLeave))
                    .catch(err => props.onError?.(err));
            } else {
                savePromise = Promise.reject();
            }
            return newState;
        });
        return savePromise;
    }, [props.onSave]);

    const handleSaveResponse = (response: FormSaveResponse<T> | void, isSavedBeforeLeave?: boolean) => {
        const newFormValue = response && response.form || formState.current.form;
        const newState: FormState<T> = {
            ...formState.current,
            historyIndex: 0,
            formHistory: [newFormValue],
            isChanged: false,
            form: newFormValue,
            isInProgress: false,
            serverValidationState: response && response.validation || formState.current.serverValidationState,
            lastSentForm: response && response.validation?.isInvalid ? (response.form || formState.current.form) : formState.current.lastSentForm,
        };

        if (response && response.validation) {
            updateFormState(() => newState);
            return;
        };

        resetForm(newState);
        removeUnsavedChanges();

        if (props.onSuccess && response) {
            props.onSuccess(response.form, isSavedBeforeLeave);
        }
    };

    const handleUndo = useCallback(() => updateFormState(currentState => {
        const { formHistory, historyIndex } = currentState;
        const previousIndex = historyIndex - 1;

        if (previousIndex >= 0) {
            const previousItem = formHistory[previousIndex];
            let newState = {
                ...currentState,
                isChanged: previousIndex !== 0,
                form: previousItem,
                historyIndex: previousIndex,
            };
            if (currentState.validationState.isInvalid) {
                newState = updateValidationStates(newState);
            }
            return newState;
        } else {
            return currentState;
        }
    }), []);

    const handleRedo = useCallback(() => updateFormState(currentState => {
        const { formHistory, historyIndex } = currentState;
        const nextIndex = historyIndex + 1;
        if (nextIndex < currentState.formHistory.length) {
            const nextItem = formHistory[nextIndex];
            let newState = { ...currentState, form: nextItem, historyIndex: nextIndex, isChanged: true };
            if (currentState.validationState.isInvalid) {
                newState = updateValidationStates(newState);
            }
            return newState;
        } else {
            return currentState;
        }
    }), []);

    const validate = useCallback(() => {
        updateFormState(currentState => updateValidationStates(currentState));
    }, [props.getMetadata]);

    const handleRevert = useCallback(() => {
        resetForm(initialForm.current);
    }, [props.value]);

    const handleValueChange = useCallback((newValue: T) => {
        handleFormUpdate(() => newValue);
    }, []);

    const handleSetValue = useCallback((value: React.SetStateAction<T>) => {
        handleFormUpdate((currentValue) => {
            let newValue: T = value instanceof Function
                ? value(currentValue)
                : value;
            return newValue;
        })
    }, []);

    const handleReplaceValue = useCallback((value: React.SetStateAction<T>) => {
        handleFormUpdate((currentValue) => {
            let newValue: T = value instanceof Function
                ? value(currentValue)
                : value;
            return newValue;
        }, { addCheckpoint: false });
    }, []);

    const saveCallback = useCallback(() => {
        handleSave().catch(() => {});
    }, [handleSave]);

    const handleClose = useCallback(() => {
        return lock.tryRelease();
    }, [lock]);

    return {
        setValue: handleSetValue,
        replaceValue: handleReplaceValue,
        isChanged: formState.current.isChanged,
        close: handleClose,
        lens,
        save: saveCallback,
        undo: handleUndo,
        redo: handleRedo,
        revert: handleRevert,
        validate,
        canUndo: formState.current.historyIndex > 0,
        canRedo: formState.current.historyIndex < (formState.current.formHistory.length - 1),
        canRevert: formState.current.form !== props.value,
        value: formState.current.form,
        onValueChange: handleValueChange,
        isInvalid: formState.current.validationState.isInvalid,
        validationMessage: formState.current.validationState.validationMessage,
        validationProps: formState.current.validationState.validationProps,
        isInProgress: formState.current.isInProgress,
    };
}

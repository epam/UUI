import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import {
    mergeValidation,
    validate as uuiValidate,
    validateServerErrorState,
} from '../../data/validation';
import { useForceUpdate } from '../../hooks';
import { UuiContexts, Link } from '../../types';
import { ValidationState } from '../lenses';
import { useUuiContext } from '../../services';
import { LensBuilder } from '../lenses/LensBuilder';
import isEqual from 'react-fast-compare';
import { FormProps, FormSaveResponse, IFormApi } from './Form';
import { useLock } from './useLock';
import { shouldCreateUndoCheckpoint } from './shouldCreateUndoCheckpoint';
import { flushSync } from 'react-dom';

interface FormState<T> {
    form: T;
    initialForm: T;
    validationState: ValidationState;
    serverValidationState: ValidationState;
    lastSentForm?: T;
    isChanged: boolean;
    formHistory: T[];
    historyIndex: number;
    isInProgress: boolean;
    isInSaveMode: boolean;
}

function getInitialFormState<T>(value: T) {
    return {
        isChanged: false,
        isInProgress: false,
        form: value,
        initialForm: value,
        validationState: { isInvalid: false },
        serverValidationState: undefined,
        formHistory: [value],
        historyIndex: 0,
        isInSaveMode: false,
    } as FormState<T>;
}

export type UseFormProps<T> = Omit<FormProps<T>, 'renderForm'>;

export function useForm<T>(props: UseFormProps<T>): IFormApi<T> {
    const context: UuiContexts = useUuiContext();

    const propsRef = useRef(props);
    propsRef.current = props;

    const formStateRef = useRef(getInitialFormState(props.value));
    const formState = formStateRef.current;

    const forceUpdate = useForceUpdate();

    const setFormState = (
        update: (current: FormState<T>) => FormState<T>,
    ) => {
        const newState = update(formStateRef.current);
        formStateRef.current = newState;
        forceUpdate();
    };

    const handleSave = useCallback((isSavedBeforeLeave?: boolean) => {
        let savePromise: any;
        setFormState((currentState) => {
            let newState = { ...currentState, isInSaveMode: true };
            newState.isInSaveMode = true;
            newState = updateValidationStates(newState);
            if (!newState.validationState.isInvalid) {
                newState.isInProgress = true;
                savePromise = propsRef.current
                    .onSave(newState.form)
                    .then((response) =>
                        handleSaveResponse(response, isSavedBeforeLeave))
                    .catch((err) => handleError(err));
            } else {
                savePromise = Promise.reject();
            }
            return newState;
        });
        return savePromise;
    }, []);

    const removeUnsavedChanges = useCallback(() => {
        context.uuiUserSettings.set(props.settingsKey, null);
    }, [context.uuiUserSettings, props.settingsKey]);

    const handleLeave = useCallback(async (nextLocation?: Link, currentLocation?: Link) => {
        if (props.beforeLeave) {
            const res = await props.beforeLeave(nextLocation, currentLocation);
            if (res === true) {
                return handleSave(true);
            }
            if (res === false) {
                removeUnsavedChanges();
                return Promise.resolve();
            }
            if (res === 'remain') {
                return Promise.resolve('remain');
            }
        }
        return Promise.resolve();
    }, [
        props.beforeLeave,
        handleSave,
        removeUnsavedChanges,
    ]);

    const { isLocked, block, unblock } = useLock({ handleLeave });

    useEffect(() => {
        const unsavedChanges = getUnsavedChanges();
        if (!unsavedChanges || !props.loadUnsavedChanges || isEqual(unsavedChanges, formState.initialForm)) return;
        props
            .loadUnsavedChanges()
            .then(() => handleFormUpdate(() => unsavedChanges))
            .catch(() => null);
    }, []);

    // Store props.value from the previous render
    const prevFormValue = useRef<T>(props.value);

    // Reset form if props.value has changed since the previous render
    useEffect(() => {
        if (!isEqual(props.value, prevFormValue.current)) {
            setFormState(() => getInitialFormState(props.value));
            prevFormValue.current = props.value;
        }
    }, [props.value]);

    const getUnsavedChanges = (): T => {
        return context.uuiUserSettings.get<T>(props.settingsKey);
    };

    const handleFormUpdate = (update: (current: T) => T, options: { addCheckpoint?: boolean } = {}) =>
        setFormState((currentState) => {
            options.addCheckpoint = options.addCheckpoint ?? true;

            const newForm = update(currentState.form);
            let { historyIndex, formHistory } = currentState;

            // Determine if change is significant and we need to create new checkpoint.
            // If false - we'll just update the latest checkpoint.
            // We need to always create a checkpoint at the first change, to save initial form state.
            const needCheckpoint = historyIndex === 0 || shouldCreateUndoCheckpoint(formHistory[historyIndex - 1], formHistory[historyIndex], newForm);

            if (options.addCheckpoint && needCheckpoint) {
                historyIndex++;
            }
            formHistory = formHistory.slice(0, historyIndex).concat(newForm);

            if (options.addCheckpoint || context.uuiUserSettings.get(props.settingsKey)) {
                context.uuiUserSettings.set(props.settingsKey, newForm);
            }

            const isChanged = !isEqual(currentState.initialForm, newForm);

            if (isChanged === true) {
                block();
            } else {
                unblock();
            }

            let newState = {
                ...currentState,
                form: newForm,
                isChanged: isChanged,
                historyIndex,
                formHistory,
            };

            if (currentState.isInSaveMode || props.validationOn === 'change') {
                newState = updateValidationStates(newState);
            }

            return newState;
        });

    const getMetadata = (value: T) =>
        propsRef.current.getMetadata ? propsRef.current.getMetadata(value) : {};

    const updateValidationStates = (state: FormState<T>): FormState<T> => {
        const valueToValidate = state.form;
        const metadata = getMetadata(valueToValidate);
        const isInSaveMode = state.isInSaveMode;
        const validationMode = isInSaveMode || !props.validationOn ? 'save' : props.validationOn;
        const validationState = uuiValidate(valueToValidate, metadata, state.initialForm, validationMode);

        const newState = { ...state, validationState };

        if (!validationState.isInvalid) {
            // When form became valid, we switch inSaveMode to false
            newState.isInSaveMode = false;
        }
        return newState;
    };

    const handleError = (err?: any) => {
        setFormState((currentValue) => ({
            ...currentValue,
            isInProgress: false,
        }));

        propsRef.current.onError?.(err);
    };

    const handleSaveResponse = (response: FormSaveResponse<T> | void, isSavedBeforeLeave?: boolean) => {
        flushSync(() => setFormState((currentState) => {
            const newFormValue = (response && response.form) || currentState.form;
            const isServerInvalid = response && response.validation && response.validation.isInvalid;
            const newState: FormState<T> = {
                ...currentState,
                historyIndex: 0,
                formHistory: [newFormValue],
                isChanged: isServerInvalid ? currentState.isChanged : false,
                form: newFormValue,
                isInProgress: false,
                serverValidationState: (response && response.validation) || currentState.serverValidationState,
                lastSentForm: response && response.validation?.isInvalid ? response.form || currentState.form : currentState.lastSentForm,
            };

            if (!isServerInvalid) {
                newState.initialForm = newFormValue;
                unblock();
                removeUnsavedChanges();
            }

            return newState;
        }));

        if (propsRef.current.onSuccess && response) {
            propsRef.current.onSuccess(response.form, isSavedBeforeLeave);
        }
    };

    const handleUndo = useCallback(
        () =>
            setFormState((currentState) => {
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
            }),
        [],
    );

    const handleRedo = useCallback(
        () =>
            setFormState((currentState) => {
                const { formHistory, historyIndex } = currentState;
                const nextIndex = historyIndex + 1;
                if (nextIndex < currentState.formHistory.length) {
                    const nextItem = formHistory[nextIndex];
                    let newState = {
                        ...currentState, form: nextItem, historyIndex: nextIndex, isChanged: true,
                    };
                    if (currentState.validationState.isInvalid) {
                        newState = updateValidationStates(newState);
                    }
                    return newState;
                } else {
                    return currentState;
                }
            }),
        [],
    );

    const validate = useCallback(() => {
        const formSate = { ...formState, isInSaveMode: true };
        const newState = updateValidationStates(formSate);
        setFormState(() => newState);

        return newState.validationState;
    }, []);

    const handleRevert = useCallback(() => {
        setFormState((current) => getInitialFormState(current.initialForm));
    }, [props.value]);

    const handleValueChange = useCallback((newValue: T) => {
        handleFormUpdate(() => newValue);
    }, []);

    const handleSetValue = useCallback((value: React.SetStateAction<T>) => {
        handleFormUpdate((currentValue) => {
            const newValue: T = value instanceof Function ? value(currentValue) : value;
            return newValue;
        });
    }, []);

    const handleReplaceValue = useCallback((value: React.SetStateAction<T>) => {
        setFormState((currentValue) => {
            const newFormValue = value instanceof Function ? value(currentValue.form) : value;
            return {
                ...currentValue,
                form: newFormValue,
            };
        });
    }, []);

    const saveCallback = useCallback(() => {
        handleSave().catch(() => {});
    }, [handleSave]);

    const handleClose = useCallback(() => {
        return isLocked ? handleLeave() : Promise.resolve();
    }, [isLocked]);

    const setServerValidationState = useCallback((value: React.SetStateAction<ValidationState>) => {
        setFormState((currentValue) => {
            const newValue = value instanceof Function ? value(currentValue.serverValidationState) : value;
            return {
                ...currentValue,
                serverValidationState: newValue,
            };
        });
    }, []);

    const getMergedValidationState = (state: FormState<T>) => {
        const {
            form, lastSentForm, serverValidationState, validationState,
        } = state;
        if (serverValidationState) {
            const serverValidation = validateServerErrorState(form, lastSentForm, serverValidationState);
            return mergeValidation(validationState, serverValidation);
        }
        return validationState;
    };

    // Build lens.
    // We still need to use formStateRef.current instead of formState,
    // More on this here: https://github.com/epam/UUI/issues/2668
    const lens = useMemo(
        () =>
            new LensBuilder<T, T>({
                get: () => formStateRef.current.form,
                set: handleFormUpdate,
                getValidationState: () => getMergedValidationState(formStateRef.current),
                getMetadata: () => getMetadata(formStateRef.current.form),
            }),
        [],
    );

    const mergedValidationState = getMergedValidationState(formState);

    return {
        setValue: handleSetValue,
        replaceValue: handleReplaceValue,
        isChanged: formState.isChanged,
        close: handleClose,
        lens,
        save: saveCallback,
        undo: handleUndo,
        redo: handleRedo,
        revert: handleRevert,
        validate,
        canUndo: formState.historyIndex > 0,
        canRedo: formState.historyIndex < formState.formHistory.length - 1,
        canRevert: formState.form !== props.value,
        value: formState.form,
        onValueChange: handleValueChange,
        isInvalid: mergedValidationState.isInvalid,
        validationMessage: mergedValidationState.validationMessage,
        validationProps: mergedValidationState.validationProps,
        serverValidationState: formState.serverValidationState,
        setServerValidationState,
        isInProgress: formState.isInProgress,
    };
}

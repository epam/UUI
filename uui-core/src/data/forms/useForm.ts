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
    validationState: ValidationState;
    serverValidationState: ValidationState;
    lastSentForm?: T;
    isChanged: boolean;
    formHistory: T[];
    historyIndex: number;
    isInProgress: boolean;
    isInSaveMode: boolean;
}

export type UseFormProps<T> = Omit<FormProps<T>, 'renderForm'>;

export function useForm<T>(props: UseFormProps<T>): IFormApi<T> {
    const context: UuiContexts = useUuiContext();

    const initialForm = useRef<FormState<T>>({
        isChanged: false,
        isInProgress: false,
        form: props.value,
        validationState: { isInvalid: false },
        serverValidationState: undefined,
        formHistory: [props.value],
        historyIndex: 0,
        isInSaveMode: false,
    });

    const propsRef = useRef(props);
    propsRef.current = props;

    const getMetadata = (value: T) =>
        propsRef.current.getMetadata ? propsRef.current.getMetadata(value) : {};

    const prevFormValue = useRef<T>(props.value);

    const formState = useRef(initialForm.current);

    const forceUpdate = useForceUpdate();

    const updateFormState = (
        update: (current: FormState<T>) => FormState<T>,
    ) => {
        const newState = update(formState.current);
        formState.current = newState;
        forceUpdate();
    };

    const handleSave = useCallback((isSavedBeforeLeave?: boolean) => {
        let savePromise: any;
        updateFormState((currentState) => {
            let newState = { ...currentState, isInSaveMode: true };
            newState.isInSaveMode = true;
            newState = updateValidationStates(newState);
            if (!newState.validationState.isInvalid) {
                newState.isInProgress = true;
                newState.serverValidationState = undefined; // reset serverValidationState if valid form is saving
                savePromise = propsRef.current
                    .onSave(formState.current.form)
                    .catch((err) => { handleError(err); return Promise.reject(); })
                    .then((response) => handleSaveResponse(response, isSavedBeforeLeave));
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

    const handleLeave = useCallback(async (nextLocation?: Link, currentLocation?: Link, beforeLeave?: FormProps<T>['beforeLeave']) => {
        if (props.beforeLeave) {
            const beforeLeaveCb = beforeLeave || props.beforeLeave;
            const res = await beforeLeaveCb(nextLocation, currentLocation);
            if (res === true) {
                return handleSave(true);
            }
            if (res === false) {
                resetForm(initialForm.current);
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

    const { isLocked, block, unblock } = useLock({ handleLeave, isEnabled: !!props.beforeLeave });

    const getMergedValidationState = () => {
        const {
            form, lastSentForm, serverValidationState, validationState,
        } = formState.current;
        if (serverValidationState) {
            const serverValidation = validateServerErrorState(form, lastSentForm, serverValidationState);
            return mergeValidation(validationState, serverValidation);
        }
        return validationState;
    };

    const lens = useMemo(
        () =>
            new LensBuilder<T, T>({
                get: () => formState.current.form,
                set: (_, small: T) => {
                    handleFormUpdate(() => small);
                    return small;
                },
                getValidationState: getMergedValidationState,
                getMetadata: () => getMetadata(formState.current.form),
            }),
        [],
    );

    useEffect(() => {
        const unsavedChanges = getUnsavedChanges();
        if (!unsavedChanges || !props.loadUnsavedChanges || isEqual(unsavedChanges, initialForm.current.form)) return;
        props
            .loadUnsavedChanges()
            .then(() => handleFormUpdate(() => unsavedChanges))
            .catch(() => null);
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

    const getUnsavedChanges = (): T => {
        return context.uuiUserSettings.get<T>(props.settingsKey);
    };

    const handleFormUpdate = (update: (current: T) => T, options?: { addCheckpoint?: boolean }) =>
        updateFormState((currentState) => {
            options = options ?? {};
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

            const isChanged = !isEqual(initialForm.current.form, newForm);

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

    const resetForm = (withNewState: FormState<T>) => {
        updateFormState((currentState) => {
            const newFormState = { ...currentState, ...withNewState };
            if (newFormState !== currentState) {
                initialForm.current = newFormState;
                return newFormState;
            }
        });

        removeUnsavedChanges();
        unblock();
    };

    const updateValidationStates = (state: FormState<T>): FormState<T> => {
        const valueToValidate = state.form;
        const metadata = getMetadata(valueToValidate);
        const isInSaveMode = state.isInSaveMode;
        const validationMode = isInSaveMode || !props.validationOn ? 'save' : props.validationOn;
        const validationState = uuiValidate(valueToValidate, metadata, initialForm.current.form, validationMode);

        const newState = { ...state, validationState };

        if (!validationState.isInvalid) {
            // When form became valid, we switch inSaveMode to false
            newState.isInSaveMode = false;
        }
        return newState;
    };

    const handleError = (err?: any) => {
        updateFormState((currentValue) => ({
            ...currentValue,
            isInProgress: false,
        }));

        propsRef.current.onError?.(err);
    };

    const handleSaveResponse = (response: FormSaveResponse<T> | void, isSavedBeforeLeave?: boolean) => {
        const newFormValue = (response && response.form) || formState.current.form;
        const newState: FormState<T> = {
            ...formState.current,
            historyIndex: 0,
            formHistory: [newFormValue],
            isChanged: response && response.validation?.isInvalid ? formState.current.isChanged : false,
            form: newFormValue,
            isInProgress: false,
            serverValidationState: (response && response.validation) || formState.current.serverValidationState,
            lastSentForm: response && response.validation?.isInvalid ? response.form || formState.current.form : formState.current.lastSentForm,
        };
        if (response && response.validation) {
            flushSync(() => {
                updateFormState(() => newState);
            });
            return Promise.reject(); // Save wasn't success, reject save promise, which is then used by handleLeave
        }
        flushSync(() => {
            resetForm(newState);
        });

        if (propsRef.current.onSuccess && response) {
            propsRef.current.onSuccess(response.form, isSavedBeforeLeave);
        }
    };

    const handleUndo = useCallback(
        () =>
            updateFormState((currentState) => {
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
            updateFormState((currentState) => {
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
        const formSate = { ...formState.current, isInSaveMode: true };
        const newState = updateValidationStates(formSate);
        updateFormState(() => newState);

        return newState.validationState;
    }, []);

    const handleRevert = useCallback(() => {
        resetForm(initialForm.current);
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
        updateFormState((currentValue) => {
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

    const handleClose = useCallback<IFormApi<T>['close']>((options) => {
        return isLocked ? handleLeave(null, null, options?.beforeLeave) : Promise.resolve();
    }, [isLocked]);

    const setServerValidationState = useCallback((value: React.SetStateAction<ValidationState>) => {
        updateFormState((currentValue) => {
            const newValue = value instanceof Function ? value(currentValue.serverValidationState) : value;
            return {
                ...currentValue,
                serverValidationState: newValue,
            };
        });
    }, []);

    const mergedValidationState = getMergedValidationState();

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
        canRedo: formState.current.historyIndex < formState.current.formHistory.length - 1,
        canRevert: formState.current.form !== props.value,
        value: formState.current.form,
        onValueChange: handleValueChange,
        isInvalid: mergedValidationState.isInvalid,
        validationMessage: mergedValidationState.validationMessage,
        validationProps: mergedValidationState.validationProps,
        serverValidationState: formState.current.serverValidationState,
        setServerValidationState,
        isInProgress: formState.current.isInProgress,
    };
}

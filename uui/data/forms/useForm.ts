import { useRef, useState, useEffect } from 'react';
import { mergeValidation, useUuiContext, UuiContexts, validate as uuiValidate, validateServerErrorState } from 'uui';
import { LensBuilder } from '../lenses/LensBuilder';
import isEqual from 'lodash.isequal';
import { FormComponentState, FormProps, FormSaveResponse, RenderFormProps } from './Form';

type UseFormProps<T> = Omit<FormProps<T>, 'renderForm' | 'prevProps'>;

export function useForm<T>(props: UseFormProps<T>): RenderFormProps<T> {
    const context: UuiContexts = useUuiContext();
    const lock = useRef<object | null>(null);
    const initialForm = useRef<FormComponentState<T>>({
        isChanged: false,
        isInProgress: false,
        form: props.value,
        validationState: { isInvalid: false },
        serverValidationState: { isInvalid: false },
        formHistory: [props.value],
        historyIndex: 0
    });

    const [formState, setFormState] = useState<FormComponentState<T>>(initialForm.current);

    const lens = useRef(new LensBuilder<T, T>({
        get: () => formState.form,
        set: (_, small: T) => {
            handleFormUpdate(small);
            return small;
        },
        getValidationState: () => {
            const { form, lastSentForm, serverValidationState, validationState } = formState;
            const serverValidation = validateServerErrorState(form, lastSentForm, serverValidationState);
            return mergeValidation(validationState, serverValidation);
        },
        getMetadata: () => props.getMetadata ? props.getMetadata(formState.form) : {},
    }));

    useEffect(() => {
        const unsavedChanges = getUnsavedChanges();
        if (!unsavedChanges || !props.loadUnsavedChanges) return;
        props.loadUnsavedChanges().then(() => handleFormUpdate(unsavedChanges));

        return () => {
            if (!lock.current) return;
            context.uuiLocks.acquire(Promise.resolve)
                .then(lock => context.uuiLocks.release(lock))
                .catch(lock => context.uuiLocks.release(lock));
        };
    }, []);

    useEffect(() => {
        if (formState.isChanged && props.beforeLeave) {
            props.beforeLeave && context.uuiLocks.withLock(handleLeave).then(receivedLock => {
                lock.current == receivedLock;
                resetForm({ ...formState, form: props.value });
            });
        } else resetForm({ ...formState, form: props.value, formHistory: [props.value] });
    }, [props.value]);

    const setUnsavedChanges = (form: T) => {
        return context.uuiUserSettings.set(props.settingsKey, form);
    };

    const removeUnsavedChanges = () => {
        return context.uuiUserSettings.set(props.settingsKey, null);
    };

    const getUnsavedChanges = (): T => {
        return context.uuiUserSettings.get<T>(props.settingsKey);
    };

    const handleFormUpdate = (newForm: T) => {
        const { validationState, historyIndex, formHistory } = formState;
        const newHistoryIndex = historyIndex + 1;
        const newFormHistory = formHistory.slice(0, newHistoryIndex).concat(newForm);
        !lock.current && getLock();
        setUnsavedChanges(newForm);
        setFormState({
            ...formState,
            form: newForm,
            isChanged: !isEqual(props.value, newForm),
            validationState: validationState,
            historyIndex: newHistoryIndex,
            formHistory: newFormHistory,
        });
    };

    const getLock = () => {
        if (!props.beforeLeave) return;
        context.uuiLocks.acquire(handleLeave).then(acquiredLock => {
            return lock.current ? context.uuiLocks.release(acquiredLock) : lock.current = acquiredLock
        });
    };

    const handleLeave = async () => {
        return props.beforeLeave?.().then(res => {
            if (res) return handleSave();
            removeUnsavedChanges();
        });
    };

    const releaseLock = () => {
        if (!props.beforeLeave || !lock.current) return;
        context.uuiLocks.release(lock.current);
        lock.current = null;
    };

    const resetForm = (withNewState: FormComponentState<T>) => {
        releaseLock();
        setFormState({ ...initialForm.current, ...withNewState });
    };

    const handleValidate = (newVal?: any) => {
        const valueToValidate = newVal || formState.form;
        const metadata = props.getMetadata ? props.getMetadata(valueToValidate) : {};
        return uuiValidate(valueToValidate, metadata);
    };

    const handleSave = () => () => {
        const validationState = handleValidate();
        setFormState({ ...formState, validationState });

        if (!validationState.isInvalid) {
            setFormState({ ...formState, isInProgress: true });
            return props.onSave(formState.form).then(handleSaveResponse).catch(err => props.onError?.(err));
        }
    };

    const handleSaveResponse = (response: FormSaveResponse<T> | void) => {
        const newState = {
            form: response && response.form || formState.form,
            isInProgress: false,
        } as FormComponentState<T>;

        if (response && response.validation) {
            newState.serverValidationState = response.validation;
            newState.lastSentForm = response.validation.isInvalid ? response.form || formState.form : undefined;
            setFormState(newState);
        } else {
            resetForm(newState);
            removeUnsavedChanges();
            props.onSuccess?.(response && response.form);
        }
    }

    const handleValueChange = (newVal: T) => {
        setFormState({ ...formState, form: newVal });
    };

    const handleRevert = () => {
        resetForm({ ...formState, form: props.value });
    };

    const handleUndo = () => {
        const { formHistory, historyIndex, validationState } = formState;
        const previousIndex = historyIndex > 0 ? historyIndex - 1 : 0;
        const previousItem = formHistory[previousIndex];

        if (previousIndex === 0) return resetForm({ ...formState, form: previousItem, formHistory });

        setFormState({
            ...formState,
            form: previousItem,
            historyIndex: previousIndex,
            validationState: validationState.isInvalid ? handleValidate(previousItem) : {}
        });
    }

    const handleRedo = () => {
        const { formHistory, historyIndex } = formState;
        const lastIndex = formHistory.length - 1;
        const nextIndex = historyIndex < lastIndex ? historyIndex + 1 : lastIndex;
        const nextItem = formHistory[nextIndex];
        setFormState({ ...formState, form: nextItem, historyIndex: nextIndex, isChanged: true });
    };

    const validate = () => {
        setFormState({ ...formState, validationState: handleValidate() });
    };

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
};
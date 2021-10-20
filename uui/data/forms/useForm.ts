import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { mergeValidation, UuiContexts, validate as uuiValidate, validateServerErrorState } from '../../index';
import { useUuiContext } from '../../';
import { LensBuilder } from '../lenses/LensBuilder';
import isEqual from 'lodash.isequal';
import type { FormComponentState, FormProps, FormSaveResponse, RenderFormProps } from './Form';
import { useLock } from './useLock';

export type UseFormProps<T> = Omit<FormProps<T>, 'renderForm'>;
type UseFormState<T> = Omit<FormComponentState<T>, 'prevProps'> & { prevProps: UseFormProps<T> };

export function useForm<T>(props: UseFormProps<T>): RenderFormProps<T> {
    const context: UuiContexts = useUuiContext();

    const initialForm = useRef<UseFormState<T>>({
        isChanged: false,
        isInProgress: false,
        form: props.value,
        validationState: { isInvalid: false },
        serverValidationState: { isInvalid: false },
        formHistory: [props.value],
        prevProps: props,
        historyIndex: 0
    });

    const [formState, setFormState] = useState<UseFormState<T>>(initialForm.current);

    const handleLeave = props.beforeLeave ? () => props.beforeLeave().then(res => {
        if (res) return handleSave();
        removeUnsavedChanges();
    }) : null;

    useLock({ isEnabled: formState.isChanged, handleLeave });

    const lens = useMemo(() => new LensBuilder<T, T>({
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
    }), [props.value, formState.form, formState.validationState, formState.lastSentForm, formState.serverValidationState]);

    useEffect(() => {
        const unsavedChanges = getUnsavedChanges();
        if (!unsavedChanges || !props.loadUnsavedChanges) return;
        props.loadUnsavedChanges().then(() => handleFormUpdate(unsavedChanges));
    }, []);

    useEffect(() => {
        if (!isEqual(props.value, initialForm.current.prevProps.value)) {
            resetForm({
                ...formState,
                form: props.value,
                formHistory: formState.isChanged ? formState.formHistory : [props.value]
            });
        };
    }, [props.value]);

    const setUnsavedChanges = (form: T) => {
        context.uuiUserSettings.set(props.settingsKey, form);
    };

    const removeUnsavedChanges = () => {
        context.uuiUserSettings.set(props.settingsKey, null);
    };

    const getUnsavedChanges = (): T => {
        return context.uuiUserSettings.get<T>(props.settingsKey);
    };

    const handleFormUpdate = (newForm: T) => {
        const { validationState, historyIndex, formHistory } = formState;
        const newHistoryIndex = historyIndex + 1;
        const newFormHistory = formHistory.slice(0, newHistoryIndex).concat(newForm);
        setUnsavedChanges(newForm);
        setFormState({
            ...formState,
            form: newForm,
            isChanged: !isEqual(props.value, newForm),
            validationState: validationState.isInvalid ? handleValidate(newForm) : validationState,
            historyIndex: newHistoryIndex,
            formHistory: newFormHistory,
        });
    };

    const resetForm = (withNewState: UseFormState<T>) => {
        setFormState({ ...initialForm.current, ...withNewState });
    };

    const handleValidate = (newVal?: T) => {
        const valueToValidate = newVal || formState.form;
        const metadata = props.getMetadata ? props.getMetadata(valueToValidate) : {};
        return uuiValidate(valueToValidate, metadata);
    };

    const handleSave = useCallback(() => {
        const validationState = handleValidate();
        setFormState({ ...formState, validationState });
        if (!validationState.isInvalid) {
            setFormState({ ...formState, isInProgress: true });
            return props.onSave(formState.form)
                .then(handleSaveResponse)
                .catch(err => props.onError?.(err));
        } else return Promise.reject();
    }, [formState.validationState, formState.form, formState.isInProgress, props.onSave, props.onError]);

    const handleSaveResponse = (response: FormSaveResponse<T> | void) => {
        const newState: UseFormState<T> = {
            ...formState,
            isChanged: false,
            form: response && response.form || formState.form,
            isInProgress: false,
            serverValidationState: response && response.validation || formState.serverValidationState,
            lastSentForm: response && response.validation?.isInvalid ? (response.form || formState.form) : formState.lastSentForm,
        };
        if (response && response.validation) return setFormState(newState);
        resetForm(newState);
        removeUnsavedChanges();
        if (!props.onSuccess || !response) return;
        props.onSuccess(response.form);
    };

    const handleUndo = useCallback(() => {
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
    }, [formState.formHistory, formState.historyIndex, formState.validationState, formState.form]);

    const handleRedo = useCallback(() => {
        const { formHistory, historyIndex } = formState;
        const lastIndex = formHistory.length - 1;
        const nextIndex = historyIndex < lastIndex ? historyIndex + 1 : lastIndex;
        const nextItem = formHistory[nextIndex];
        setFormState({ ...formState, form: nextItem, historyIndex: nextIndex, isChanged: true });
    }, [formState.formHistory, formState.historyIndex, formState.form, formState.isChanged]);

    const validate = useCallback(() => {
        setFormState({ ...formState, validationState: handleValidate() });
    }, [formState.form, props.getMetadata]);

    const handleRevert = useCallback(() => {
        resetForm({ ...formState, form: props.value });
    }, [props.value]);

    const handleValueChange = useCallback((newVal: T) => {
        setFormState({ ...formState, form: newVal })
    }, [formState.form]);

    return {
        isChanged: formState.isChanged,
        lens,
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
import { useRef, useEffect, useMemo, useCallback } from 'react';
import { mergeValidation, useForceUpdate, UuiContexts, validate as uuiValidate, validateServerErrorState } from '../../index';
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
        historyIndex: 0,
    });

    const formState = useRef(initialForm.current);

    const forceUpdate = useForceUpdate();

    const setFormState = (newValue: UseFormState<T>) => {
        formState.current = newValue;
        forceUpdate();
    };

    const handleLeave = props.beforeLeave ? () => props.beforeLeave().then(res => {
        if (res) return handleSave();
        removeUnsavedChanges();
    }) : null;

    useLock({ isEnabled: formState.current.isChanged, handleLeave });

    const lens = useMemo(() => new LensBuilder<T, T>({
        get: () => formState.current.form,
        set: (_, small: T) => {
            handleFormUpdate(small);
            return small;
        },
        getValidationState: () => {
            const { form, lastSentForm, serverValidationState, validationState } = formState.current;
            const serverValidation = validateServerErrorState(form, lastSentForm, serverValidationState);
            return mergeValidation(validationState, serverValidation);
        },
        getMetadata: () => props.getMetadata ? props.getMetadata(formState.current.form) : {},
    }), [props.value, formState.current.form, formState.current.validationState, formState.current.lastSentForm, formState.current.serverValidationState]);

    useEffect(() => {
        const unsavedChanges = getUnsavedChanges();
        if (!unsavedChanges || !props.loadUnsavedChanges) return;
        props.loadUnsavedChanges().then(() => handleFormUpdate(unsavedChanges));
    }, []);

    useEffect(() => {
        if (!isEqual(props.value, initialForm.current.prevProps.value)) {
            resetForm({
                ...formState.current,
                form: props.value,
                formHistory: formState.current.isChanged ? formState.current.formHistory : [props.value],
            });
        }
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
        const { validationState, historyIndex, formHistory } = formState.current;
        const newHistoryIndex = historyIndex + 1;
        const newFormHistory = formHistory.slice(0, newHistoryIndex).concat(newForm);
        setUnsavedChanges(newForm);
        setFormState({
            ...formState.current,
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
        const valueToValidate = newVal || formState.current.form;
        const metadata = props.getMetadata ? props.getMetadata(valueToValidate) : {};
        return uuiValidate(valueToValidate, metadata);
    };

    const handleSave = useCallback((isSavedBeforeLeave?: boolean) => {
        const validationState = handleValidate();
        setFormState({ ...formState.current, validationState });
        if (!validationState.isInvalid) {
            setFormState({ ...formState.current, isInProgress: true });
            return props.onSave(formState.current.form)
                .then((response) => handleSaveResponse(response, isSavedBeforeLeave))
                .catch(err => props.onError?.(err));
        } else return Promise.reject();
    }, [formState.current.validationState, formState.current.form, formState.current.isInProgress, props.onSave, props.onError]);

    const handleSaveResponse = (response: FormSaveResponse<T> | void, isSavedBeforeLeave?: boolean) => {
        const newState: UseFormState<T> = {
            ...formState.current,
            isChanged: false,
            form: response && response.form || formState.current.form,
            isInProgress: false,
            serverValidationState: response && response.validation || formState.current.serverValidationState,
            lastSentForm: response && response.validation?.isInvalid ? (response.form || formState.current.form) : formState.current.lastSentForm,
        };
        if (response && response.validation) return setFormState(newState);
        resetForm(newState);
        removeUnsavedChanges();
        if (!props.onSuccess || !response) return;
        props.onSuccess(response.form, isSavedBeforeLeave);
    };

    const handleUndo = useCallback(() => {
        const { formHistory, historyIndex, validationState } = formState.current;
        const previousIndex = historyIndex > 0 ? historyIndex - 1 : 0;
        const previousItem = formHistory[previousIndex];
        if (previousIndex === 0) return resetForm({ ...formState.current, form: previousItem, formHistory });
        setFormState({
            ...formState.current,
            form: previousItem,
            historyIndex: previousIndex,
            validationState: validationState.isInvalid ? handleValidate(previousItem) : {},
        });
    }, [formState.current.formHistory, formState.current.historyIndex, formState.current.validationState, formState.current.form]);

    const handleRedo = useCallback(() => {
        const { formHistory, historyIndex } = formState.current;
        const lastIndex = formHistory.length - 1;
        const nextIndex = historyIndex < lastIndex ? historyIndex + 1 : lastIndex;
        const nextItem = formHistory[nextIndex];
        setFormState({ ...formState.current, form: nextItem, historyIndex: nextIndex, isChanged: true });
    }, [formState.current.formHistory, formState.current.historyIndex, formState.current.form, formState.current.isChanged]);

    const validate = useCallback(() => {
        setFormState({ ...formState.current, validationState: handleValidate() });
    }, [formState.current.form, props.getMetadata]);

    const handleRevert = useCallback(() => {
        resetForm({ ...formState.current, form: props.value });
    }, [props.value]);

    const handleValueChange = useCallback((newVal: T) => {
        setFormState({ ...formState.current, form: newVal });
    }, [formState.current.form]);

    return {
        isChanged: formState.current.isChanged,
        lens,
        save: handleSave,
        undo: handleUndo,
        redo: handleRedo,
        revert: handleRevert,
        validate,
        canUndo: formState.current.historyIndex !== 0,
        canRedo: formState.current.historyIndex !== formState.current.formHistory.length - 1,
        canRevert: formState.current.form !== props.value,
        value: formState.current.form,
        onValueChange: handleValueChange,
        isInvalid: formState.current.validationState.isInvalid,
        isInProgress: formState.current.isInProgress,
    };
}
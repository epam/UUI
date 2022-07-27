import React, { ReactNode } from 'react';
import { useForm } from './useForm';
import { IEditable, ILens, Metadata, ICanBeInvalid, ValidationMode } from '../../';

export interface FormSaveResponse<T> {
    form?: T;
    validation?: ICanBeInvalid;
}

export interface FormProps<T> {
    renderForm: (props: RenderFormProps<T>) => ReactNode;
    getMetadata?(state: T): Metadata<T>;
    onSave(state: T): Promise<FormSaveResponse<T> | void>;
    beforeLeave?: (() => Promise<boolean>) | null;
    loadUnsavedChanges?: () => Promise<void>;
    onSuccess?(state: T, isSavedBeforeLeave?: boolean): any;
    onError?(error: any): any;
    settingsKey?: string;
    validationOn?: ValidationMode;
    value: T;
}

export interface RenderFormProps<T> extends IEditable<T>, ICanBeInvalid {
    setValue: (s: React.SetStateAction<T>) => void;
    save(): void;
    undo(): void;
    redo(): void;
    revert(): void;
    validate(): void;
    canUndo: boolean;
    canRedo: boolean;
    canRevert: boolean;
    lens: ILens<T>;
    isChanged: boolean;
    isInProgress: boolean;
}

export function Form<T>({ renderForm, ...props }: FormProps<T>) {
    const useFormProps = useForm<T>(props);
    return <>{ renderForm(useFormProps) }</>;
}
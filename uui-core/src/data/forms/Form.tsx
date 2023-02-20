import React, { ReactNode } from 'react';
import { useForm } from './useForm';
import { IEditable, ILens, Metadata, ICanBeInvalid, ValidationMode } from '../../../index';

export interface FormSaveResponse<T> {
    form?: T;
    validation?: ICanBeInvalid;
}

export interface FormProps<T> {
    /** Current value of the form state */
    value: T;

    /**
     * Render the form body, provided by form state
     * */
    renderForm: (props: IFormApi<T>) => ReactNode;

    /**
     * Returns form metadata - information used to validate the form.
     * @param state Metadata can depend on state, and will be re-computed on updates
     */
    getMetadata?(state: T): Metadata<T>;

    /**
     * Occurs when 'save' function is called on Form.
     * Should save form data (usually with API call to server).
     * Server can also reject form, and provide validation errors in response.
     * @param state Form state to save
     */
    onSave(state: T): Promise<FormSaveResponse<T> | void>;

    /**
     * Called when form is unmounted, but user still have unsaved changes.
     * Accepts a Promise<boolean> to be returned. If promise resolves to true - save procedure is performed.
     * The common use-case is to show a modal with "Save Changes?" dialog
     * Skins usually implement this as default behavior. To prevent it, you can pass null to this prop to override it.
     */
    beforeLeave?: (() => Promise<boolean>) | null;

    /**
     * Used to restore unsaved user edits from the last session (usually to localstorage, via uuiUserSettings context)
     * If unsaved changes are detected, this callback is called. If it is resolved - the form restores unsaved edits.
     * The common use-case is to show a modal with "You have unsaved changes, restore them?" dialog
     * Skins usually implement this as default behavior. To prevent it, you can pass null to this prop to override it.
     */
    loadUnsavedChanges?: () => Promise<void>;

    /**
     * Called after successful save.
     * @param state Saved state
     * @param isSavedBeforeLeave true, if save is triggered via leaving the page, and "Save Changes?" dialog
     */
    onSuccess?(state: T, isSavedBeforeLeave?: boolean): any;

    /** Called when save fails */
    onError?(error: any): any;

    /**
     * The key, under which form save unsaved state usually to localstorage, via uuiUserSettings context)
     */
    settingsKey?: string;

    /**
     * Controls when form validation occurs:
     * save (default, recommended) - form is validated on save. If form is invalid - it will be revalidated on every change, until become valid
     * change - form is validated on every user change. Only fields changes in current edit session are validated
     */
    validationOn?: ValidationMode;
}

export interface IFormApi<T> extends IEditable<T>, ICanBeInvalid {
    /**
     * Lens - a helper to split parts of the form state, validation, and setState callbacks, and pass this to components
     */
    lens: ILens<T>;

    /**
     * Sets form value. The signature is the same for setState in React.useState - either new value, or callback to update the value.
     * The change is threated as user input - sets isChanged and creates undo endpoint
     */
    setValue: (s: React.SetStateAction<T>) => void;

    /**
     * Replaces form value. The signature is the same for setState in React.useState - either new value, or callback to update the value.
     * The change is not threated as user input - it replaces last changed state, and doesn't create undo checkpoint.
     */
    replaceValue: (s: React.SetStateAction<T>) => void;

    /**
     * Triggers save procedure - validation, calling props.onSave, and processing results
     */
    save(): void;

    /**
     * Undo to last checkpoint
     */
    undo(): void;

    /**
     * Redo last action
     */
    redo(): void;

    /**
     * Reverts all changes up to the initial or last saved state
     */
    revert(): void;

    /**
     * Try to leave form and ask to save unsaved changes
     */
    close(): Promise<any>;

    /**
     * Forces form to validate value.
     * Validation is usually done automatically, according to validationOn prop.
     * Use this method only in corner cases.
     */
    validate(): void;

    /** True if there are changes to undo */
    canUndo: boolean;

    /** True if there are changes to redo */
    canRedo: boolean;

    /** True if there are changes to revers */
    canRevert: boolean;

    /** True if form is changed since the initial state, or the last save */
    isChanged: boolean;

    /** True if save is in progress */
    isInProgress: boolean;
}

export function Form<T>({ renderForm, ...props }: FormProps<T>) {
    const useFormProps = useForm<T>(props);
    return <>{renderForm(useFormProps)}</>;
}

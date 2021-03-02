import * as React from 'react';
import isEqual from 'lodash.isequal';
import { IEditable, ILens, Metadata, FormState, ICanBeInvalid, UuiContexts, uuiContextTypes } from '../../';
import { LensBuilder } from '../lenses/LensBuilder';
import {validate, validateServerErrorState, mergeValidation} from "../validation";

export interface FormSaveResponse<T> {
    form?: T;
    validation?: ICanBeInvalid;
}

export interface FormProps<T> {
    renderForm: (props: RenderFormProps<T>) => React.ReactNode;
    getMetadata?(state: T): Metadata<T>;
    onSave(state: T): Promise<FormSaveResponse<T> | void>;
    beforeLeave?: (() => Promise<boolean>) | null;
    loadUnsavedChanges?: () => Promise<void>;
    onSuccess?(state: T): any;
    onError?(error: any): any;
    settingsKey?: string;
    value: T;
}

export interface RenderFormProps<T> extends IEditable<T>, ICanBeInvalid {
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

export interface FormComponentState<T> extends FormState<T> {
    prevProps?: FormProps<T>;
    formHistory: T[];
    historyIndex: number;
    isInProgress: boolean;
}

export class Form<T> extends React.Component<FormProps<T>, FormComponentState<T>> {

    static contextTypes = uuiContextTypes;
    context: UuiContexts;
    lock: object | null;
    isUnmounted: boolean;

    baseState: FormComponentState<T> = {
        isChanged: false,
        isInProgress: false,
        form: this.props.value,
        validationState: {
            isInvalid: false,
        },
        serverValidationState: {
            isInvalid: false,
        },
        prevProps: this.props,
        formHistory: [this.props.value],
        historyIndex: 0,
    };

    lens: ILens<T>;

    constructor(props: FormProps<T>, context: UuiContexts) {
        super(props, context);
        this.state = this.baseState;
        this.lens = new LensBuilder<T, T>({
            get: () => this.state.form,
            set: (big: any, small: any) => {
                this.handleFormUpdate(small);
                return small;
            },
            getValidationState: (big: any) => this.getMergedValidationState(),
            getMetadata: (big: any) => this.props.getMetadata ? this.props.getMetadata(this.state.form) : {},
        });
    }

    componentWillUnmount() {
        this.isUnmounted = true;
        this.lock && this.context.uuiLocks.acquire(() => Promise.resolve())
            .then((lock) => this.context.uuiLocks.release(lock))
            .catch((lock) => this.context.uuiLocks.release(lock));
    }

    componentDidMount() {
        this.isUnmounted = false;
        const unsavedChanges = this.getUnsavedChanges();

        if (unsavedChanges) {
            this.props.loadUnsavedChanges && this.props.loadUnsavedChanges()
                .then(() => !this.isUnmounted && this.handleFormUpdate(unsavedChanges));
        }
    }
    
    getMergedValidationState() {
        const serverValidation = validateServerErrorState(
            this.state.form,
            this.state.lastSentForm,
            this.state.serverValidationState,
        );
        return mergeValidation(this.state.validationState, serverValidation);
    }

    //TODO: rework componentWillReceiveProps to getDerivedStateFromProps

    // static getDerivedStateFromProps(nextProps: FormProps<any>, state: FormComponentState<any>) {
    //     const prevProps = state.prevProps;

    //     if (nextProps.value != prevProps.value) {
    //         return { prevProps: nextProps, form: nextProps.value };
    //     } else {
    //         return null;
    //     }
    // }

    // componentDidUpdate() {
    //     debugger;
    //     if (this.state.prevProps.value != this.state.form) {
    //         this.setState({ form: this.state.prevProps.value });
    //     }
    // }

    getUnsavedChanges(): T {
        const unsavedChanges: T = this.context.uuiUserSettings.get<T>(this.props.settingsKey);

        return unsavedChanges;
    }

    setUnsavedChanges(form: T): void {
        this.context.uuiUserSettings.set(this.props.settingsKey, form);
    }

    removeUnsavedChanges(): void {
        this.context.uuiUserSettings.set(this.props.settingsKey, null);
    }

    handleFormUpdate(newForm: T) {
        let newHistoryIndex = this.state.historyIndex + 1;
        let newFormHistory = this.state.formHistory.slice(0, newHistoryIndex);
        newFormHistory.push(newForm);
        !this.lock && this.getLock();
        let validationState = this.state.validationState;
        if (validationState.isInvalid) {
            validationState = this.handleValidate(newForm);
        }
        let isChanged = this.isFormChanged(newForm);
        this.setUnsavedChanges(newForm);
        this.setState({
            ...this.state,
            form: newForm,
            isChanged: isChanged,
            validationState: validationState,
            historyIndex: newHistoryIndex,
            formHistory: newFormHistory,
        });
    }

    isFormChanged(newForm: T) {
        return !isEqual(this.props.value, newForm);
    }

    handleLeave = () => {
        return this.props.beforeLeave && this.props.beforeLeave()
            .then(res => {
                if (res) {
                    return this.handleSave();
                } else {
                    this.removeUnsavedChanges();
                }

                return Promise.resolve();
            });
    }

    componentWillReceiveProps(nextProps: FormProps<T>) {
        if (this.props.value !== nextProps.value) {
            if (this.state.isChanged && this.props.beforeLeave) {
                this.props.beforeLeave && this.context.uuiLocks.withLock(this.handleLeave)
                    .then((lock: object) => {
                        this.lock = lock;

                        this.resetForm({ form: nextProps.value });
                    });
            }  else {
                this.resetForm({ form: nextProps.value, formHistory: [nextProps.value] });
            }
        }
    }

    releaseLock() {
        if (!this.props.beforeLeave || !this.lock) {
            return;
        }

        this.context.uuiLocks.release(this.lock);
        this.lock = null;
    }

    resetForm = (valueToSave?: any) => {
        this.releaseLock();
        this.setState({ ...this.baseState, ...valueToSave });
    }


    getLock = () => {
        if (!this.props.beforeLeave) {
            return;
        }

        this.context.uuiLocks.acquire(this.handleLeave)
            .then((lock: object) => this.lock ? this.context.uuiLocks.release(lock) : this.lock = lock);
    }

    handleValidate = (newVal?: any) => {
        const valueToValidate = newVal || this.state.form;
        const metadata = this.props.getMetadata ? this.props.getMetadata(valueToValidate) : {};
        return validate(valueToValidate, metadata);
    }

    handleSave: () => void = () => {
        let validationState = this.handleValidate();
        this.setState({ validationState });

        if (!validationState.isInvalid) {
            this.setState({ isInProgress: true });
    
            return this.props.onSave(this.state.form)
                .then(this.handleSaveResponse)
                .catch(err => this.props.onError?.(err));
        }
    }
    
    handleSaveResponse = (response: FormSaveResponse<T> | void) => {
        const newState = {
            form: response && response.form || this.state.form,
            isInProgress: false,
        } as FormComponentState<T>;
        
        if (response && response.validation) {
            newState.serverValidationState = response.validation;
            newState.lastSentForm = response.validation.isInvalid
                ? response.form || this.state.form
                : undefined;
            this.setState(newState);
        } else {
            this.resetForm(newState);
            this.removeUnsavedChanges();
            this.props.onSuccess && this.props.onSuccess(response && response.form);
        }
    }

    handleValueChange = (newVal: T) => {
        this.setState({ form: newVal });
    }

    handleRevert = () => {
        this.resetForm({ form: this.props.value });
    }

    handleUndo = () => {
        let previousIndex = this.state.historyIndex > 0 ? this.state.historyIndex - 1 : 0;
        let previousItem = this.state.formHistory[previousIndex];

        if (previousIndex === 0) {
            return this.resetForm({ form: previousItem, formHistory: this.state.formHistory });
        }

        let validationState = {};

        if (this.state.validationState.isInvalid) {
            validationState = this.handleValidate(previousItem);
        }

        this.setState({ form: previousItem, historyIndex: previousIndex, validationState });
    }

    handleRedo = () => {
        let lastIndex = this.state.formHistory.length - 1;
        let nextIndex = this.state.historyIndex < lastIndex ? this.state.historyIndex + 1 : lastIndex;
        let nextItem = this.state.formHistory[nextIndex];
        this.setState({ form: nextItem, historyIndex: nextIndex, isChanged: true });
    }

    validate = () => {
        const validationState = this.handleValidate();
        this.setState({validationState});
    }

    render() {
        return this.props.renderForm({
            isChanged: this.state.isChanged,
            lens: this.lens,
            save: this.handleSave,
            undo: this.handleUndo,
            redo: this.handleRedo,
            revert: this.handleRevert,
            validate: this.validate,
            canUndo: this.state.historyIndex !== 0,
            canRedo: this.state.historyIndex !== this.state.formHistory.length - 1,
            canRevert: this.state.form !== this.props.value,
            value: this.state.form,
            onValueChange: this.handleValueChange,
            isInvalid: this.state.validationState.isInvalid,
            isInProgress: this.state.isInProgress,
        });
    }
}

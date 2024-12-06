import { LensBuilder } from './LensBuilder';
import { IEditable } from '../../types';
import { ILens } from './types';

/** @deprecated This helper to be removed in future versions, as it's intended for Class-components, and very rarely used */
export function onEditableComponent<T>(component: any): ILens<T> {
    return new LensBuilder<T, T>({
        get() {
            return component.props.value;
        },
        set(update) {
            const newValue = update(component.props.value);
            component.props.onValueChange(newValue);
        },
        getValidationState() {
            const { isInvalid, validationMessage, validationProps } = component.props;
            return { isInvalid, validationMessage, validationProps };
        },
        getMetadata() {
            const {
                isReadonly, isDisabled, isRequired, props, all,
            } = component.props;
            return {
                isReadonly, isDisabled, isRequired, props, all,
            };
        },
    });
}

export function onEditable<T>(editable: IEditable<T>): ILens<T> {
    return new LensBuilder<T, T>({
        get() {
            return editable.value;
        },
        set(update) {
            const newValue = update(editable.value);
            editable.onValueChange(newValue);
        },
        getValidationState() {
            return editable;
        },
    });
}

/** @deprecated This helper to be removed in future versions, as it's intended for Class-components, and very rarely used */
export function onState<T>(component: any): ILens<T> {
    return new LensBuilder<T, T>({
        get() {
            return component.state;
        },
        set(update) {
            const newValue = update(component.state);
            component.setState(newValue);
        },
    });
}

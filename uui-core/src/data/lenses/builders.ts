import { LensBuilder } from './LensBuilder';
import { IEditable } from '../../types';
import { ILens } from './types';

/** @deprecated This helper to be removed in future versions, as it's intended for Class-components, and very rarely used */
export function onEditableComponent<T>(component: any): ILens<T> {
    return new LensBuilder<T, T>({
        get() {
            return component.props.value;
        },
        set(big: any, small: any) {
            component.props.onValueChange(small);
            return small;
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
        set(big: any, small: any) {
            editable.onValueChange(small);
            return small;
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
        set(_, small: any) {
            component.setState(small);
            return small;
        },
    });
}

import * as React from 'react';
import { LensBuilder } from './LensBuilder';
import {IEditable, ICanBeInvalid, Metadata} from '../../types';
import { ILens } from './types';

// Can't setup type inference here, as putting this here makes a cyclic type reference
export function onEditableComponent<T>(component: any): ILens<T> {
    return new LensBuilder<T, T>({
        get(big: any) { return component.props.value; },
        set(big: any, small: any) { component.props.onValueChange(small); return small; },
        getValidationState(big: ICanBeInvalid) {
            const { isInvalid, validationMessage, validationProps } = component.props;
            return { isInvalid, validationMessage, validationProps };
        },
        getMetadata(big: Metadata<T>) {
            let { isReadonly, isDisabled, isRequired, props, all} = component.props;
            return { isReadonly, isDisabled, isRequired, props, all };
        },
    });
}

export function onEditable<T>(editable: IEditable<T>): ILens<T> {
    return new LensBuilder<T, T>({
        get(big: any) { return editable.value; },
        set(big: any, small: any) { editable.onValueChange(small); return small; },
        getValidationState(big: any) { return editable; },
    });
}

export function onState<T>(component: any): ILens<T> {
    return new LensBuilder<T, T>({
        get(big: any) { return component.state; },
        set(big: any, small: any) { component.setState(small); return small; },
    });
}

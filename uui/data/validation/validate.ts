import {ICanBeInvalid} from '../../types';
import {i18n} from "../../i18n";
import {Metadata} from "../../types";

export const blankValidationState: ICanBeInvalid = {};

export function validate<T>(value: T, meta: Metadata<T>): ICanBeInvalid {
    let result: ICanBeInvalid = { isInvalid: false };

    if (meta.props) {
        for (let key in meta.props) {
            let childMeta = meta.props[key];

            if (childMeta) {
                validateItem(key, value && value[key], childMeta, result);
            }
        }
    } else {
        result = validateValue(value, meta);
    }

    if (meta.all && value != null) {
        for (let key in value) {
            validateItem(key, (value as any)[key], meta.all, result);
        }
    }

    return result;
}

function validateValue(value: any, meta: Metadata<any>): any {
    if (meta.validators) {
        const customValidationMessages = meta.validators
            .map(validator => validator(value))
            .reduce((a, b) => a.concat(b), [])
            .filter(msg => !!msg);

        if (customValidationMessages.length > 0) {
            return {
                isInvalid: true,
                validationMessage: customValidationMessages[0],
            };
        }
    }

    if (meta.isRequired) {
        if (value == null
            || (typeof value === "string" && value.trim() === "")
            || (Array.isArray(value) && value.length == 0)
        ) {
            return {
                isInvalid: true,
                validationMessage: i18n.lenses.validation.isRequiredMessage,
            };
        }
    }

    if (meta.minValue != null && value != null && value < meta.minValue) {
        return {
            isInvalid: true,
            validationMessage: i18n.lenses.validation.lessThanMinimumValueMessage(meta.minValue),
        };
    }

    if (meta.maxValue != null && value != null && value > meta.maxValue) {
        return {
            isInvalid: true,
            validationMessage: i18n.lenses.validation.greaterThanMaximumValueMessage(meta.maxValue),
        };
    }

    if (meta.maxLength != null && value != null && value.length > meta.maxLength) {
        return {
            isInvalid: true,
            validationMessage: i18n.lenses.validation.greaterThanMaximumLengthMessage(meta.maxLength),
        };
    }

    return {
        isInvalid: false,
    };
}

function validateItem(key: string, value: any, meta: Metadata<any>, parentResult: ICanBeInvalid) {
    const valueResult = validateValue(value, meta);
    const recursiveResult = validate(value, meta);

    recursiveResult.isInvalid = recursiveResult.isInvalid || valueResult.isInvalid;

    if (valueResult.message) {
        recursiveResult.validationMessage = valueResult.message;
    }

    parentResult.validationProps = parentResult.validationProps || {};
    parentResult.validationProps[key] = recursiveResult;
    parentResult.isInvalid = parentResult.isInvalid || recursiveResult.isInvalid;
}
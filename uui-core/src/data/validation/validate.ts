import { i18n } from '../../i18n';
import { Metadata } from '../../types';
import { ValidationState } from '../lenses';

export type ValidationMode = 'change' | 'save';
export const blankValidationState: ValidationState = {};

type Iterable<U> = U & { [Symbol.iterator](): IterableIterator<[string, unknown]> };
type IterableWithGet<U> = Iterable<U> & { get(key: string): unknown };

const isIterable = <U>(value: U): value is Iterable<U> => typeof value === 'object' && Symbol.iterator in value;
const shouldAccessWithGet = <U>(value: U): value is IterableWithGet<U> => typeof value === 'object' && 'get' in value;

const getValue = <U extends {}>(key: string, value: U) => {
    if (value === null || typeof value !== 'object') {
        return undefined;
    }

    if (shouldAccessWithGet(value)) {
        return value.get(key);
    }

    return value[key as keyof U];
};

export const validate = <T>(value: T, meta: Metadata<T>, initValue: T, validateOn: ValidationMode): ValidationState => {
    const validateRec = <U>(innerValue: U, path: U[], innerMeta: Metadata<U>, innerInitValue: U): ValidationState => {
        const itemResult: ValidationState = validateValue(innerValue, path, innerMeta);
        const validateItem = (key: string, validationMeta: Metadata<any>) => {
            const childValue = getValue(key, innerValue);
            const newPath = [childValue, ...path];
            const initChildValue = getValue(key, innerInitValue);
            const isChildChanged = childValue !== initChildValue;

            let childResult;
            switch (validateOn) {
                case 'change': {
                    childResult = isChildChanged ? validateRec(childValue, newPath, validationMeta, initChildValue) : { isInvalid: false };
                    break;
                }
                case 'save': {
                    childResult = validateRec(childValue, newPath, validationMeta, initChildValue);
                }
            }

            itemResult.isInvalid = childResult.isInvalid || itemResult.isInvalid;
            itemResult.validationProps = itemResult.validationProps || {};
            itemResult.validationProps[key] = childResult;
        };

        if (innerMeta.props) {
            for (const key in innerMeta.props) {
                const childMeta = innerMeta.props[key];
                if (childMeta) {
                    validateItem(key, childMeta);
                }
            }
        }

        if (innerMeta.all && innerValue != null) {
            if (!Array.isArray(innerValue) && isIterable(innerValue)) {
                for (const [key] of innerValue) {
                    validateItem(key, innerMeta.all);
                }
            } else {
                for (const key in innerValue) {
                    validateItem(key, innerMeta.all);
                }
            }
        }

        return itemResult;
    };
    return validateRec(value, [value], meta, initValue);
};

const validateValue = (value: any, path: any[], meta: Metadata<any>): ValidationState => {
    if (meta.validators) {
        const customValidationMessages = meta.validators
            .map((validator) => validator.apply(null, path))
            .reduce((a, b) => a.concat(b), [])
            .filter((msg: string | null) => !!msg);

        if (customValidationMessages.length > 0) {
            return {
                isInvalid: true,
                validationMessage: customValidationMessages[0],
            };
        }
    }

    if (meta.isRequired) {
        if (value == null || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0)) {
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
};

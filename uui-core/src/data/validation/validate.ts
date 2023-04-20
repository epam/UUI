import { ICanBeInvalid } from '../../types';
import { i18n } from '../../i18n';
import { Metadata } from '../../types';

export type ValidationMode = 'change' | 'save';
export const blankValidationState: ICanBeInvalid = {};

export const validate = <T>(value: T, meta: Metadata<T>, initValue: T, validateOn: ValidationMode): ICanBeInvalid => {
    const validateRec = <T>(value: T, path: T[], meta: Metadata<T>, initValue: T): ICanBeInvalid => {
        const itemResult: ICanBeInvalid = validateValue(value, path, meta, initValue);
        const validateItem = (key: string, meta: Metadata<any>) => {
            const childValue = value && (value as any)[key];
            const newPath = [childValue, ...path];
            const initChildValue = initValue && (initValue as any)[key];
            const isChildChanged = childValue !== initChildValue;

            let childResult;
            switch (validateOn) {
                case 'change': {
                    childResult = isChildChanged ? validateRec(childValue, newPath, meta, initChildValue) : {};
                    break;
                }
                case 'save': {
                    childResult = validateRec(childValue, newPath, meta, initChildValue);
                }
            }

            itemResult.isInvalid = childResult.isInvalid || itemResult.isInvalid;
            itemResult.validationProps = itemResult.validationProps || {};
            itemResult.validationProps[key] = childResult;
        };

        if (meta.props) {
            for (const key in meta.props) {
                const childMeta = meta.props[key];
                if (childMeta) {
                    validateItem(key, childMeta);
                }
            }
        }

        if (meta.all && value != null) {
            for (const key in value) {
                validateItem(key, meta.all);
            }
        }
        return itemResult;
    };
    return validateRec(value, [value], meta, initValue);
};

const validateValue = (value: any, path: any[], meta: Metadata<any>, initValue: any): ICanBeInvalid => {
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
        if (value == null || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length == 0)) {
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

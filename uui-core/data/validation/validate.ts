import { ICanBeInvalid } from '../../types';
import { i18n } from "../../i18n";
import { Metadata } from "../../types";
import isEqual from "lodash.isequal";

export type ValidationMode = "change" | "save";
export const blankValidationState: ICanBeInvalid = {};

export const validate = <T>(value: T, meta: Metadata<T>, initValue: T, validateOn: ValidationMode): ICanBeInvalid => {
    const validateRec = <T>(value: T, path: T[], meta: Metadata<T>, initValue: T): ICanBeInvalid => {
        let itemResult: ICanBeInvalid = validateValue(value, path, meta, initValue);
        const validateItem = (key: string, meta: Metadata<any>) => {
            const childValue = value && (value as any)[key];
            const newPath = [childValue, ...path];
            const initChildValue = initValue && (initValue as any)[key];
            const childResult = validateRec(childValue, newPath, meta, initChildValue);
            const setResult = () => {
                itemResult.isInvalid = childResult.isInvalid || itemResult.isInvalid;
                itemResult.isChanged = childResult.isChanged || itemResult.isChanged;
                itemResult.validationProps = itemResult.validationProps || {};
                itemResult.validationProps[key] = childResult;
            };
            switch (validateOn) {
                case "change": {
                    if (childResult.isChanged) {
                        setResult();
                    }
                    break;
                }
                default: {
                    setResult();
                }
            }

        };

        if (meta.props) {
            for (let key in meta.props) {
                const childMeta = meta.props[key];
                if (childMeta) {
                    validateItem(key, childMeta);
                }
            }
        }

        if (meta.all && value != null) {
            for (let key in value) {
                validateItem(key, meta.all);
            }
        }
        return itemResult;
    };
    return validateRec(value, [value], meta, initValue);
};

const validateValue = (value: any, path: any[], meta: Metadata<any>, initValue: any): ICanBeInvalid => {
    const isChanged = !isEqual(value, initValue);
    const result: ICanBeInvalid = {
        isInvalid: false,
        isChanged,
    };

    if (meta.validators) {
        const customValidationMessages = meta.validators
            .map(validator => validator.apply(null, path))
            .reduce((a, b) => a.concat(b), [])
            .filter((msg: string | null) => !!msg);

        if (customValidationMessages.length > 0) {
            result.isInvalid = true;
            result.validationMessage = customValidationMessages[0];
            return result;
        }
    }

    if (meta.isRequired) {
        if (value == null
            || (typeof value === "string" && value.trim() === "")
            || (Array.isArray(value) && value.length == 0)
        ) {
            result.isInvalid = true;
            result.validationMessage = i18n.lenses.validation.isRequiredMessage;
            return result;
        }
    }

    if (meta.minValue != null && value != null && value < meta.minValue) {
        result.isInvalid = true;
        result.validationMessage = i18n.lenses.validation.lessThanMinimumValueMessage(meta.minValue);
        return result;
    }

    if (meta.maxValue != null && value != null && value > meta.maxValue) {
        result.isInvalid = true;
        result.validationMessage = i18n.lenses.validation.greaterThanMaximumValueMessage(meta.maxValue);
        return result;
    }

    if (meta.maxLength != null && value != null && value.length > meta.maxLength) {
        result.isInvalid = true;
        result.validationMessage = i18n.lenses.validation.greaterThanMaximumLengthMessage(meta.maxLength);
        return result;
    }

    return result;
};
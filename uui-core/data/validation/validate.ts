import { ICanBeChanged, ICanBeInvalid } from '../../types';
import { i18n } from "../../i18n";
import { Metadata } from "../../types";

export const blankValidationState: ICanBeInvalid = {};

export function validate<T>(value: T, meta: Metadata<T>): ICanBeInvalid {
    return validateRec(value, [value], meta);
}

export function validateRec<T>(value: T, path: any[], meta: Metadata<T>): ICanBeInvalid {
    let result: ICanBeInvalid = validateValue(value, path, meta);

    const validateItem = (key: string, meta: Metadata<any>) => {
        let childValue = value && (value as any)[key];
        let newPath = [childValue, ...path];
        const childResult = validateRec(childValue, newPath, meta);
        result.isInvalid = result.isInvalid || childResult.isInvalid;
        result.validationProps = result.validationProps || {};
        result.validationProps[key] = childResult;
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

    return result;
}

function validateValue(value: any, path: any[], meta: Metadata<any>): any {
    if (meta.validators) {
        const customValidationMessages = meta.validators
            .map(validator => validator.apply(null, path))
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


export const getChanges = <T>(initValues?: T, value?: T, key?: any, meta?: Metadata<T>): ICanBeChanged => {
    let resultPath = [key] as [any];
    // console.log("meta", meta.props, "key", key)
    getChangesPath(key, resultPath, meta);
    if (resultPath?.length) {
        const initValue = resultPath.reduce((acc, value) => {
            return acc?.[value];
        }, initValues);
        // console.log("initValue", initValue, "value", value);
        return { isChanged: value !== initValue };
    }
    return { isChanged: false };
};

export const getChangesPath = <T>(key?: any, path?: [any], meta?: Metadata<T>) => {
    let metadata = meta.props || meta.all?.props;
    if (metadata) {
        for (let childKey in metadata) {
            if (metadata.hasOwnProperty(path[path.length - 1])) {
                path.unshift(key);
                break;
            } else {
                const childMeta = (metadata as any)[childKey];
                if (childMeta) {
                    getChangesPath(childKey, path, childMeta);
                }
            }
        }
    }
}
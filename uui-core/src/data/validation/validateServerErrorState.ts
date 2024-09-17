import { ValidationState } from '../lenses';

export function validateServerErrorState<T extends any>(currentFormState: T, lastSentFormState: T, serverValidation: ValidationState) {
    let result: ValidationState = { isInvalid: false };

    if (serverValidation.validationProps) {
        Object.keys(serverValidation.validationProps).forEach((key) => {
            const childProps = serverValidation.validationProps[key];
            validateItem(key, currentFormState?.[key as keyof typeof currentFormState], lastSentFormState?.[key as keyof typeof lastSentFormState], childProps, result);
        });
    } else {
        result = validateValue(currentFormState, lastSentFormState, serverValidation);
    }

    return result;
}

function validateValue(newValue: any, oldValue: any, validationProp: ValidationState): ValidationState {
    if (!validationProp.isInvalid) return { isInvalid: false };

    return newValue === oldValue
        ? {
            isInvalid: true,
            validationMessage: validationProp.validationMessage,
        }
        : {
            isInvalid: false,
        };
}

function validateItem(key: string, currentFormStatePart: any, lastSavedFormStatePart: any, serverValidation: ValidationState, parentResult: ValidationState) {
    const valueResult = validateValue(currentFormStatePart, lastSavedFormStatePart, serverValidation);
    const recursiveResult = validateServerErrorState(currentFormStatePart, lastSavedFormStatePart, serverValidation);

    recursiveResult.isInvalid = recursiveResult.isInvalid || valueResult.isInvalid;

    if (valueResult.validationMessage) {
        recursiveResult.validationMessage = valueResult.validationMessage;
    }

    parentResult.validationProps = parentResult.validationProps || {};
    parentResult.validationProps[key] = recursiveResult;
    parentResult.isInvalid = parentResult.isInvalid || recursiveResult.isInvalid;
}

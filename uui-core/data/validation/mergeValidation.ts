import { ICanBeInvalid } from "../../types";

export function mergeValidation<T>(clientValidation: ICanBeInvalid, serverValidation: ICanBeInvalid) {
    const isChanged = clientValidation.isChanged;
    const result = serverValidation.isInvalid ? serverValidation : clientValidation;
    if (typeof isChanged === 'boolean') result.isChanged = isChanged;

    if (clientValidation.isInvalid) mergeValidationProps(clientValidation.validationProps, result);

    return result;
}

function mergeValidationProps(validationProps: ICanBeInvalid["validationProps"], resultPart: ICanBeInvalid) {
    if (!validationProps) return;
    if (!resultPart.validationProps) resultPart.validationProps = {};
    
    Object.keys(validationProps).forEach(key => {
        const prop = validationProps[key];
        const isInvalid = prop.isInvalid || resultPart.validationProps[key]?.isInvalid || false;
        const isChanged = prop.isChanged;
        const validationMessage = prop.validationMessage
            ?? resultPart.validationProps[key]?.validationMessage;

        resultPart.validationProps[key] = validationMessage 
            ? {
                isInvalid,
                validationMessage,
            }
            : {
                isInvalid,
            };

        if (typeof isChanged === 'boolean') {
            resultPart.validationProps[key].isChanged = isChanged;
        }
        if (prop.isInvalid) {
            mergeValidationProps(prop.validationProps, resultPart.validationProps[key]);
        }
    });
}
import {ICanBeInvalid} from "../../types";

export function mergeValidation<T>(clientValidation: ICanBeInvalid, serverValidation: ICanBeInvalid) {
    const result = serverValidation.isInvalid ? serverValidation : clientValidation;

    if (clientValidation.isInvalid) mergeValidationProps(clientValidation.validationProps, result);

    return result;
}

function mergeValidationProps(validationProps: ICanBeInvalid["validationProps"], resultPart: ICanBeInvalid) {
    if (!validationProps) return;
    if (!resultPart.validationProps) resultPart.validationProps = {};
    
    Object.keys(validationProps).forEach(key => {
        const prop = validationProps[key];
        const isInvalid = prop.isInvalid || resultPart.validationProps[key]?.isInvalid || false;
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

        if (prop.isInvalid) {
            mergeValidationProps(prop.validationProps, resultPart.validationProps[key]);
        }
    });
}
import { ShadowToken, TokenObject } from './types';
import { isVariable, isGradient, replaceJsonVarsFromGradient, createVariableToken, createSizeString, createShadowString, isObject } from './helpers';

export const transformHandler = {
    color: (value: string): string => {
        if (isVariable(value)) {
            return createVariableToken(value);
        } else if (isGradient(value)) {
            return replaceJsonVarsFromGradient(value);
        } else {
            return value;
        }
    },
    borderRadius: (value: string) => {
        if (isVariable(value)) {
            return createVariableToken(value);
        } else {
            return createSizeString(value);
        }
    },
    sizing: (value: string): string => {
        if (isVariable(value)) {
            return createVariableToken(value);
        } else {
            return createSizeString(value);
        }
    },
    spacing: (value: string) => {
        if (isVariable(value)) {
            return createVariableToken(value);
        } else {
            return createSizeString(value);
        }
    },
    typography: (token: TokenObject) => {}, // TODO: add handler as needed
    opacity: (value: string) => {
        if (isVariable(value)) {
            return createVariableToken(value);
        } else {
            return value;
        }
    },
    borderWidth: (value: string) => {
        if (isVariable(value)) {
            return createVariableToken(value);
        } else {
            return createSizeString(value);
        }
    },
    boxShadow: (value: ShadowToken | ShadowToken[] | string) => {
        if (Array.isArray(value)) {
            return value
                .map((token) => {
                    return createShadowString(token);
                })
                .join(', ');
        } else {
            if (isObject(value)) {
                return createShadowString(value as ShadowToken);
            } else if (isVariable(value as string)) {
                return createVariableToken(value as string);
            } else {
                return value;
            }
        }
    },
    fontFamilies: (value: string) => {
        if (isVariable(value)) {
            return createVariableToken(value);
        } else {
            return value;
        }
    },
    fontWeights: (value: string) => {
        if (isVariable(value)) {
            return createVariableToken(value);
        } else {
            return value;
        }
    },
    lineHeights: (value: string) => {
        if (isVariable(value)) {
            return createVariableToken(value);
        } else {
            return createSizeString(value);
        }
    },
    fontSizes: (value: string) => {
        if (isVariable(value)) {
            return createVariableToken(value);
        } else {
            return createSizeString(value);
        }
    },
    letterSpacing: (value: string) => {
        if (isVariable(value)) {
            return createVariableToken(value);
        } else {
            return createSizeString(value);
        }
    },
    paragraphSpacing: (value: string) => {
        if (isVariable(value)) {
            return createVariableToken(value);
        } else {
            return createSizeString(value);
        }
    },
    textDecoration: (value: string) => {
        if (isVariable(value)) {
            return createVariableToken(value);
        } else {
            return value;
        }
    },
    textCase: (value: string) => {
        if (isVariable(value)) {
            return createVariableToken(value);
        } else {
            return value;
        }
    },
    other: (value: string) => {
        if (isVariable(value)) {
            return createVariableToken(value);
        } else {
            return value;
        }
    },
};

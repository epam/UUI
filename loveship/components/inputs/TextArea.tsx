import React from 'react';
import { withMods } from '@epam/uui-core';
import { TextArea as uuiTextArea, TextAreaProps as UuiTextAreaProps, TextAreaMods as UuiTextAreaMods } from "@epam/uui";

export interface TextAreaMods {
    size?: UuiTextAreaMods["size"];
    mode?: UuiTextAreaMods["mode"];
}

export function applyTextAreaMods() {
    return [
        'uui-theme-loveship',
    ];
}

export const TextArea = withMods<UuiTextAreaProps, TextAreaMods>(
    uuiTextArea,
    applyTextAreaMods,
);

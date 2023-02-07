import React from 'react';
import { withMods } from '@epam/uui-core';
import { TextArea as uuiTextArea, TextAreaProps as UuiTextAreaProps } from "@epam/uui";

export function applyTextAreaMods() {
    return [
        'uui-theme-loveship',
    ];
}

export const TextArea = withMods<UuiTextAreaProps>(
    uuiTextArea,
    applyTextAreaMods,
);

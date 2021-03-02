import * as React from 'react';
import { withMods } from '@epam/uui';
import { TextArea as uuiTextArea, TextAreaProps } from '@epam/uui-components';
import * as css from './TextArea.scss';
import * as types from '../types';

const defaultSize = '36';

export interface TextAreaMods {
    size?: types.ControlSize;
}

export function applyTextAreaMods(mods: TextAreaMods) {
    return [
        css.root,
        css['size-' + (mods.size || defaultSize)],
    ];
}

export const TextArea = withMods<TextAreaProps, TextAreaMods>(
    uuiTextArea,
    applyTextAreaMods,
);
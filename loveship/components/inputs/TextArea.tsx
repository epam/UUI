import React from 'react';
import { withMods } from '@epam/uui';
import { TextArea as uuiTextArea, TextAreaProps } from '@epam/uui-components';
import * as css from './TextArea.scss';
import * as colorStyle from '../../assets/styles/scss/loveship-color-vars.scss';
import { getTextClasses, TextSettings } from '../../helpers/textLayout';
import * as types from '../types';

export interface TextAreaMods extends types.EditMode, TextSettings {
    size?: types.ControlSize | '60' | '42';
}

export function applyTextAreaMods(mods: TextAreaMods) {
    return [
        colorStyle.colorSky,
        css.root,
        css['size-' + (mods.size || '36')],
        css['mode-' + (mods.mode || 'form')],
    ];
}

export const TextArea = withMods<TextAreaProps, TextAreaMods>(
    uuiTextArea,
    applyTextAreaMods,
    (props) => ({
        inputCx: getTextClasses({
            size: props.size || '36',
            lineHeight: props.lineHeight,
            fontSize: props.fontSize,
        }, true),
    }),
);
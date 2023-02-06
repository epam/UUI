import React from 'react';
import { withMods } from '@epam/uui-core';
import { TextArea as uuiTextArea, TextAreaProps } from '@epam/uui-components';
import colorStyle from '../../assets/styles/scss/loveship-color-vars.scss';
import { getTextClasses, TextSettings } from '../../helpers/textLayout';
import * as types from '../types';
import css from './TextArea.scss';

export interface TextAreaMods extends types.EditMode, TextSettings {
    size?: types.ControlSize | '60';
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

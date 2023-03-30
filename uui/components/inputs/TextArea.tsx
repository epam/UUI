import * as React from 'react';
import { withMods } from '@epam/uui-core';
import { TextArea as uuiTextArea, TextAreaProps as UuiTextAreaProps } from '@epam/uui-components';
import * as types from '../types';
import css from './TextArea.scss';

const defaultSize = '36';
const defaultMode = types.EditMode.FORM;

export interface TextAreaMods extends types.IHasEditMode {
    size?: types.ControlSize;
}

export function applyTextAreaMods(mods: TextAreaMods) {
    return [
        css.root,
        css['size-' + (mods.size || defaultSize)],
        css['mode-' + (mods.mode || defaultMode)],
    ];
}

export type TextAreaProps = UuiTextAreaProps & TextAreaMods;

export const TextArea = withMods<UuiTextAreaProps, TextAreaMods>(
    uuiTextArea,
    applyTextAreaMods,
    props => ({
        autoSize: props.mode === types.EditMode.CELL ? true : props.autoSize,
        maxLength: props.mode === types.EditMode.CELL ? undefined : props.maxLength,
    }),
);

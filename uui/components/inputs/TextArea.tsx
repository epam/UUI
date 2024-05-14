import { withMods } from '@epam/uui-core';
import { TextArea as uuiTextArea, TextAreaProps as uuiTextAreaProps } from '@epam/uui-components';
import * as types from '../types';
import css from './TextArea.module.scss';

const DEFAULT_SIZE = '36';
const DEFAULT_MODE = types.EditMode.FORM;

type TextAreaMods = types.IHasEditMode & {
    /**
     * Defines component size.
     * @default '36'
     */
    size?: '24' | '30' | '36' | '42' | '48';
};

function applyTextAreaMods(mods: TextAreaMods) {
    return [
        css.root,
        css['size-' + (mods.size || DEFAULT_SIZE)],
        css['mode-' + (mods.mode || DEFAULT_MODE)],
    ];
}

/** Represents the properties of a TextArea component. */
export type TextAreaProps = uuiTextAreaProps & TextAreaMods;

export const TextArea = withMods<uuiTextAreaProps, TextAreaMods>(
    uuiTextArea,
    applyTextAreaMods,
    (props) => {
        return {
            autoSize: props.mode === types.EditMode.CELL ? true : props.autoSize,
            maxLength: props.mode === types.EditMode.CELL ? undefined : props.maxLength,
        };
    },
);

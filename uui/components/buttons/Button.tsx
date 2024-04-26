import * as uuiComponents from '@epam/uui-components';
import { devLogger, withMods } from '@epam/uui-core';
import { ControlSize } from '../types';
import { systemIcons } from '../../icons/icons';
import css from './Button.module.scss';

const DEFAULT_SIZE = '36';

type ButtonMods = {
    /**
     * Defines component size.
     * @default '36'
     */
    size?: ControlSize | '18' | 'inherit';
    /**
     * Defines component fill style.
     * @default 'solid'
     */
    fill?: 'solid' | 'outline' | 'ghost' | 'none';
    /**
     * Defines component color.
     * @default 'primary'
     */
    color?: 'accent' | 'primary' | 'critical' | 'secondary' | 'neutral' | 'white';
};

/** Represents the 'Core properties' for the Button component. */
export type ButtonCoreProps = uuiComponents.ButtonProps;

/** Represents the props for a Button component. */
export type ButtonProps = ButtonMods & ButtonCoreProps;

function applyButtonMods(mods: ButtonProps) {
    return [
        css.root,
        'uui-button',
        `uui-fill-${mods.fill || 'solid'}`,
        `uui-color-${mods.color || 'primary'}`,
        `uui-size-${mods.size || DEFAULT_SIZE}`,
    ];
}

export const Button = withMods<uuiComponents.ButtonProps, ButtonMods>(
    uuiComponents.Button,
    applyButtonMods,
    (props) => {
        if (__DEV__ && props.captionCX) {
            devLogger.warn('Button: Property \'captionCX\' is deprecated and will be removed in the future release. Please use \'cx\' prop to access caption styles and use cascading to change the styles for the \'uui-caption\' global class');
        }

        return {
            dropdownIcon: systemIcons.foldingArrow,
            clearIcon: systemIcons.clear,
        };
    },
);

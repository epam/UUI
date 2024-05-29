import * as uuiComponents from '@epam/uui-components';
import { withMods, Overwrite, devLogger } from '@epam/uui-core';
import css from './IconButton.module.scss';
import { systemIcons } from '../../icons/icons';

interface IconButtonMods {
    /**
     * Defines component color.
     * @default 'neutral'
     */
    color?: 'info' | 'success' | 'error' | 'primary' | 'accent' | 'critical' | 'warning' | 'secondary' | 'neutral';
}

/** Represents the Core properties of the IconButton component. */
export type IconButtonCoreProps = Omit<uuiComponents.IconButtonProps, 'size'> & {
    /**
     * Defines component size.
     */
    size?: '18' | '24' | '30' | '36';
};

export interface IconButtonModsOverride {}

/** Represents the properties of the IconButton component. */
export type IconButtonProps = IconButtonCoreProps & Overwrite<IconButtonMods, IconButtonModsOverride>;

function applyIconButtonMods(props: IconButtonProps) {
    return ['uui-icon_button', `uui-color-${props.color || 'neutral'}`, css.root];
}

export const IconButton = withMods<uuiComponents.IconButtonProps, IconButtonProps>(
    uuiComponents.IconButton,
    applyIconButtonMods,
    (props) => {
        if (__DEV__ && ['info', 'success', 'error'].includes(props.color)) {
            devLogger.warnAboutDeprecatedPropValue<IconButtonProps, 'color'>({
                component: 'IconButton',
                propName: 'color',
                propValue: props.color,
                condition: () => ['info', 'success', 'error'].includes(props.color),
            });
        }
        return {
            dropdownIcon: props.dropdownIcon || systemIcons.foldingArrow,
            size: props.size && Number(props.size),
        };
    },
);

import { IconContainer } from '@epam/uui-components';
import { cx } from '@epam/uui-core';
import React from 'react';
import { IconButton, IconButtonProps } from '../buttons';
import css from './ControlIcon.module.scss';

type ControlIconProps = Pick<IconButtonProps, 'cx' | 'icon' | 'isDisabled' | 'onClick' | 'rawProps'>;

export function ControlIcon(props: ControlIconProps): React.ReactNode {
    if (
        !props.onClick
        || props.isDisabled
    ) {
        // No point in rendering the container, if there is nothing in it.
        if (!props.icon) {
            return null;
        }

        return (
            <IconContainer
                icon={ props.icon }
                cx={ cx(css.controlIcon, props.cx) }
            />
        );
    }

    return (
        <IconButton
            icon={ props.icon }
            onClick={ props.onClick }
            cx={ cx(css.controlIcon, props.cx) }
            rawProps={ props.rawProps }
        />
    );
}

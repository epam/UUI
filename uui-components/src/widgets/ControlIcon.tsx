import React from 'react';
import { IconButton, IconButtonProps } from '../buttons';
import { IconContainer } from '../layout/IconContainer';
import css from './ControlIcon.module.scss';

type ControlIconProps = Pick<IconButtonProps, 'icon' | 'onClick' | 'isDisabled'>;

export function ControlIcon(props: ControlIconProps): React.ReactNode {
    if (!props.icon) {
        return null;
    }

    if (
        !props.onClick
        || props.isDisabled
    ) {
        return (
            <IconContainer
                icon={ props.icon }
                cx={ css.controlIcon }
            />
        );
    }

    return (
        <IconButton
            icon={ props.icon }
            onClick={ props.onClick }
            cx={ css.controlIcon }
            rawProps={ {
                'aria-label': 'Icon in input',
            } }
        />
    );
}

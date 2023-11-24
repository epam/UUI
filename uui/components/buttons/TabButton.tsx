import React from 'react';
import { Button, ButtonProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { getIconClass } from './helper';
import { CountIndicator } from '../widgets';
import { systemIcons } from '../../icons/icons';
import css from './TabButton.module.scss';

export interface TabButtonMods {
    /**
     * @default '48'
     */
    size?: '36' | '48' | '60';
    withNotify?: boolean;
}

export type TabButtonProps = TabButtonMods & ButtonProps;

function applyTabButtonMods(mods: TabButtonProps) {
    return [
        css.root,
        'uui-tab-button',
        css['size-' + (mods.size || '48')],
        mods.withNotify && css.withNotify,
        ...getIconClass(mods),
    ];
}

export const TabButton = withMods<ButtonProps, TabButtonMods>(Button, applyTabButtonMods, (props) => ({
    dropdownIcon: systemIcons['36'].foldingArrow,
    clearIcon: systemIcons['36'].clear,
    ...props,
    rawProps: { role: 'tab', ...(props.rawProps as any) },
    countIndicator: (countIndicatorProps) => (
        <CountIndicator
            { ...countIndicatorProps }
            color={ props.isLinkActive ? 'info' : 'neutral' }
            size="18"
        />
    ),
}));

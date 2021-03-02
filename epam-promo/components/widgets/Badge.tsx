import * as React from 'react';
import * as css from './Badge.scss';
import * as styles from '../../assets/styles/colorvars/widgets/badge-colorvars.scss';
import * as buttonCss from '../buttons/Button.scss';
import { Button, ButtonProps } from '@epam/uui-components';
import { withMods } from '@epam/uui';
import * as point from '../../icons/radio-point.svg';
import { systemIcons } from "../../icons/icons";
import { EpamAdditionalColor, FontMod } from '../types';

const defaultSize = '36';

const mapSize = {
    '42': '48',
    '36': '36',
    '30': '30',
    '24': '30',
    '18': '18',
};

export interface BadgeMods extends FontMod {
    fill?: 'solid' | 'semitransparent' | 'transparent';
    size?: '18' | '24' | '30' | '36' | '42';
    color?: EpamAdditionalColor;
}

export function applyBadgeMods(mods: BadgeMods) {
    return [
        buttonCss.root,
        css['size-' + (mods.size || defaultSize)],
        css['fill-' + (mods.fill || 'solid')],
        styles['badge-color-' + (mods.color || 'blue')],
        css.root,
    ];
}

export const Badge = withMods<ButtonProps, BadgeMods>(
    Button,
    applyBadgeMods,
    (props) => ({
        count: (props.fill === 'transparent') ? null : props.count,
        icon: (props.fill === 'transparent') ? point : props.icon,
        dropdownIcon: systemIcons[props.size && mapSize[props.size] || defaultSize].foldingArrow,
        clearIcon: systemIcons[props.size && mapSize[props.size] || defaultSize].clear,
        countPosition: "left",
    }),
);
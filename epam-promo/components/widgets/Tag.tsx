import { withMods } from '@epam/uui-core';
import { Button, ButtonProps } from '@epam/uui-components';
import { systemIcons } from '../../icons/icons';
import buttonCss from '../buttons/Button.scss';
import styles from '../../assets/styles/colorvars/widgets/tag-colorvars.scss';
import css from './Tag.scss';

const defaultSize = '36';

const mapSize = {
    '48': '48',
    '42': '48',
    '36': '36',
    '30': '30',
    '24': '30',
    '18': '18',
};

export interface TagMods {
    size?: '18' | '24' | '30' | '36' | '42' | '48';
}

export function applyTagMods(mods: TagMods) {
    return [
        buttonCss.root,
        styles['tag-color'],
        css['size-' + (mods.size || defaultSize)],
        css.root,
    ];
}

export const Tag = withMods<ButtonProps, TagMods>(
    Button,
    applyTagMods,
    (props) => ({
        dropdownIcon: systemIcons[mapSize[props.size] || defaultSize].foldingArrow,
        clearIcon: systemIcons[mapSize[props.size] || defaultSize].clear,
    }),
);

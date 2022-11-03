import { withMods } from '@epam/uui-core';
import { Button, ButtonProps } from '@epam/uui-components';
import { getIcon } from '../../icons';
import * as buttonCss from '../buttons/Button/Button.scss';
import '../../assets/styles/variables/widgets/tag.scss';
import * as css from './Tag.scss';

const mapSize = {
    '48': '48',
    '42': '48',
    '36': '36',
    '30': '30',
    '24': '30',
    '18': '18',
};

export interface TagMods {
    size?: string;
}

export function applyTagMods(mods: TagMods) {
    return [
        buttonCss.root,
        'tag-vars',
        css['size-' + (mods.size)],
        css.root,
    ];
}

export const Tag = withMods<ButtonProps, TagMods>(
    Button,
    applyTagMods,
    (props) => ({
        dropdownIcon: getIcon('foldingArrow'),
        clearIcon: getIcon('clear'),
    }),
);
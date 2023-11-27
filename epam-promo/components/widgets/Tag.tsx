import { withMods } from '@epam/uui-core';
import * as uui from '@epam/uui';
import { EpamPrimaryColor } from '../types';

export interface TagMods extends Omit<uui.TagProps, 'color'> {
    /**
     * @default 'gray30'
     */
    color?: EpamPrimaryColor | 'blue' | 'white' | 'gray10' | 'gray30' | 'gray70';
}

export interface TagProps extends Omit<uui.TagProps, 'color'>, TagMods {}

export const Tag = withMods<Omit<TagProps, 'color'>, TagMods>(
    uui.Tag,
    () => [],
    (props) => ({
        color: props.color || 'gray30',
    } as TagProps),
);

import { withMods } from '@epam/uui-core';
import * as uui from '@epam/uui';
import { EpamPrimaryColor } from '../types';

const defaultSize = '18';

export interface TagMods extends Omit<uui.TagProps, 'color'> {
    /**
     * @default '18'
     */
    size?: uui.TagMods['size'];
    /**
     * @default 'night300'
     */
    color?: EpamPrimaryColor | 'white' | 'night100' | 'night300' | 'night700';
}

export interface TagProps extends Omit<uui.TagProps, 'color'>, TagMods {}

export const Tag = withMods<Omit<TagProps, 'color'>, TagMods>(
    uui.Tag as any, // TODO: rework after new withMods implementation.
    () => [],
    (props) => ({
        size: props.size || defaultSize,
        color: props.color || 'night300',
    }),
);

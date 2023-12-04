import React from 'react';
import { IconList, IPropDocEditor } from '../types';
import { IconPickerWithInfo } from '../components/iconPicker/IconPicker';

/**
 * It's a temporary hack, because currently we don't support collecting all icons in the "uui-docs" module like in "app".
 * The "app" uses webpack-specific API for this. And "uui-docs" is built using Rollup.
 */
type TIconListGetterHack = { getIconList?: () => IconList<any>[] };

export function IconEditor(props: IPropDocEditor & TIconListGetterHack) {
    const { value, onValueChange, getIconList } = props;
    if (!getIconList) {
        throw new Error('getIconList is mandatory');
    }
    const icons = getIconList();
    const editable = { value, onValueChange };
    return (
        <IconPickerWithInfo icons={ icons } { ...editable } enableInfo={ true } />
    );
}

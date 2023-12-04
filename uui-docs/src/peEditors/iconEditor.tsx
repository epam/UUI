import React from 'react';
import { IconList, IPropDocEditor } from '../types';
import { IconPickerWithInfo } from '../components/iconPicker/IconPicker';
import { Icon } from '@epam/uui-core';

export function IconEditor(props: IPropDocEditor<IconList<Icon>>) {
    const { value, onValueChange, examples } = props;
    const editable = { value, onValueChange };
    const icons = examples.map((e) => e.value);
    return (
        <IconPickerWithInfo icons={ icons } { ...editable } enableInfo={ true } />
    );
}

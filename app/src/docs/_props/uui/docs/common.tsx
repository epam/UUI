import * as React from 'react';
import { IHasIcon } from '@epam/uui-core';
import { ColorPicker, DocBuilder, IPropDocEditor } from '@epam/uui-docs';
import { ColorMod } from '@epam/uui';
import { getIconList } from '../../../../documents/iconListHelpers';
import { IconPickerWithInfo } from '../components/iconPicker/IconPicker';

export const colorDoc = new DocBuilder<ColorMod>({ name: 'Color' }).prop('color', {
    editorType: function UuiColorPicker(props: IPropDocEditor) {
        const { value, onValueChange } = props;
        const examples = props.examples?.map((ex) => ({ value: ex.value }));
        const editable = { value, onValueChange };
        return (
            <ColorPicker colors={ examples } { ...editable } />
        );
    },
});

export const iconWithInfoDoc = new DocBuilder<IHasIcon>({ name: 'Icon' }).prop('icon', {
    editorType: IconPickerWithInfo,
    examples: getIconList(true).map((i) => ({ value: i as any })),
});

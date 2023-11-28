import * as React from 'react';
import { ColorPicker, DocBuilder, IPropDocEditor } from '@epam/uui-docs';
import { ColorMod } from '@epam/uui';

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

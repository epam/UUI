import * as React from 'react';
import { ColorPicker, DocBuilder, IPropDocEditor } from '@epam/uui-docs';
import { ColorMod } from '@epam/promo';
import { colors } from './helpers/colorMap';

export const colorDoc = new DocBuilder<ColorMod>({ name: 'Color' }).prop('color', {
    editorType: function PromoColorPicker(props: IPropDocEditor) {
        const { value, onValueChange } = props;
        const examples = props.examples?.map((ex) => ({ value: ex.value, hex: colors[ex.value as keyof typeof colors] }));
        const editable = { value, onValueChange };
        return (
            <ColorPicker colors={ examples } { ...editable } />
        );
    },
});

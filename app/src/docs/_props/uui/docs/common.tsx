import * as React from 'react';
import { IHasIcon } from '@epam/uui-core';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { ColorMod } from '@epam/uui';
import { getIconList } from '../../../../documents/iconListHelpers';
import { IconPicker } from '../../epam-promo/docs';

export const colorDoc = new DocBuilder<ColorMod>({ name: 'Color' }).prop('color', {
    renderEditor: (editable: any, examples) => <ColorPicker colors={ examples.map((i) => ({ value: i })) } { ...editable } />,
});

export const iconWithInfoDoc = new DocBuilder<IHasIcon>({ name: 'Icon' }).prop('icon', {
    renderEditor: (editable: any, examples) => <IconPicker icons={ examples } { ...editable } enableInfo={ true } />,
    examples: getIconList(true).map((i) => ({ value: i as any })),
});

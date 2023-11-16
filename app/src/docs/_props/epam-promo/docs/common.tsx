import * as React from 'react';
import { IHasIcon, Icon } from '@epam/uui-core';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { ColorMod } from '@epam/promo';
import { getIconList } from '../../../../documents/iconListHelpers';
import { IconPicker } from './editors';
import { colors } from './helpers/colorMap';

export const colorDoc = new DocBuilder<ColorMod>({ name: 'Color' }).prop('color', {
    editorType: (editable, examples) => <ColorPicker colors={ examples.map((i) => ({ value: i, hex: colors[i] })) } { ...editable } />,
});

export const iconWithInfoDoc = new DocBuilder<IHasIcon>({ name: 'Icon' }).prop('icon', {
    editorType: (editable: any, examples) => <IconPicker icons={ examples } { ...editable } enableInfo={ true } />,
    examples: getIconList<Icon>(true).map((i) => ({ value: i as any })),
});

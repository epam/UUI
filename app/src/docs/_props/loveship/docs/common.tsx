import * as React from 'react';
import { IHasIcon, Icon } from '@epam/uui-core';
import { ColorPicker, IconPicker } from './index';
import { DocBuilder } from '@epam/uui-docs';
import {
    allSizes, SizeMod, FontMod, ColorMod, allFontStyles, commonControlColors,
} from '@epam/loveship';
import { TextMods, IHasEditMode } from '@epam/uui';
import { getIconList } from '../../../../documents/iconListHelpers';
import { colors } from './helpers/colorMap';

export const sizeDoc = new DocBuilder<SizeMod>({ name: 'Size' }).prop('size', { examples: allSizes, defaultValue: '36' });

type TextSettings = Pick<TextMods, 'lineHeight' | 'fontSize'>;
export const textSettingsDoc = new DocBuilder<TextSettings>({ name: 'Text' })
    .prop('lineHeight', {
        examples: [
            '12', '18', '24', '30',
        ],
    })
    .prop('fontSize', {
        examples: [
            '10', '12', '14', '16', '18',
        ],
    });

export const fontDoc = new DocBuilder<FontMod>({ name: 'Font' }).prop('font', { examples: allFontStyles, defaultValue: 'sans' });

export const colorDoc = new DocBuilder<ColorMod>({ name: 'Color' }).prop('color', {
    renderEditor: (editable, examples) => <ColorPicker colors={ examples.map((i) => ({ value: i, hex: colors[i] })) } { ...editable } />,
    examples: commonControlColors,
});

export const iconDoc = new DocBuilder<IHasIcon>({ name: 'Icon' }).prop('icon', {
    renderEditor: (editable: any, examples) => <IconPicker icons={ examples } { ...editable } />,
    examples: getIconList<Icon>(true).map((i) => ({ value: i as any })),
});

export const iconWithInfoDoc = new DocBuilder<IHasIcon>({ name: 'Icon' }).prop('icon', {
    renderEditor: (editable: any, examples, props) => <IconPicker icons={ examples } { ...editable } { ...props } enableInfo={ true } />,
    examples: getIconList<Icon>(true).map((i) => ({ value: i as any })),
});

export const iconOptionsDoc = new DocBuilder<IHasIcon>({ name: 'Icon' })
    .prop('iconPosition', { examples: ['left', 'right'], defaultValue: 'left' })
    .prop('onIconClick', { examples: (ctx) => [ctx.getCallback('onIconClick')] });

export const modeDoc = new DocBuilder<IHasEditMode>({ name: 'Mode' }).prop('mode', {
    examples: [
        'form', 'inline', 'cell',
    ],
    defaultValue: 'form',
});

export * from '@epam/uui-docs';

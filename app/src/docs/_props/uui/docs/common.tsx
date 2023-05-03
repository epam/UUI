import * as React from 'react';
import { Icon, IHasIcon } from '@epam/uui-core';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import {
    allSizes, IHasEditMode, allSemanticColors, SizeMod, ColorMod,
} from '@epam/uui';
import { getIconList } from '../../../../documents/iconListHelpers';
import { IconPicker } from '../../epam-promo/docs';

export const sizeDoc = new DocBuilder<SizeMod>({ name: 'Size' }).prop('size', { examples: allSizes, defaultValue: '36' });

interface TextSettings {
    lineHeight?: '12' | '18' | '24' | '30';
    fontSize?: '10' | '12' | '14' | '16' | '18' | '24';
}
export const textSettingsDoc = new DocBuilder<TextSettings>({ name: 'Text' })
    .prop('lineHeight', {
        examples: [
            '12', '18', '24', '30',
        ],
    })
    .prop('fontSize', {
        examples: [
            '10', '12', '14', '16', '18', '24',
        ],
    });

// export const fontDoc = new DocBuilder<FontMod>({ name: 'Font' })
//     .prop('font', { examples: allFontStyles, defaultValue: 'sans' });

export const colorDoc = new DocBuilder<ColorMod>({ name: 'Color' }).prop('color', {
    renderEditor: (editable: any, examples) => <ColorPicker colors={ examples.map((i) => ({ value: i })) } { ...editable } />,
    examples: allSemanticColors,
});

// export const iconDoc = new DocBuilder<IHasIcon>({ name: 'Icon' })
//     .prop('icon', {
//         renderEditor: (editable: any, examples) => <IconPicker icons={ examples } { ...editable }/>,
//         examples: getIconList<Icon>(true).map(i => ({ value: i as any })),
//     });

export const iconWithInfoDoc = new DocBuilder<IHasIcon>({ name: 'Icon' }).prop('icon', {
    renderEditor: (editable: any, examples, props) => <IconPicker icons={ examples } { ...editable } { ...props } enableInfo={ true } />,
    examples: getIconList<Icon>(true).map((i) => ({ value: i as any })),
});

export const iconOptionsDoc = new DocBuilder<IHasIcon>({ name: 'Icon' })
    .prop('iconPosition', { examples: ['left', 'right'], defaultValue: 'left' })
    .prop('onIconClick', { examples: (ctx) => [ctx.getCallback('onIconClick')] });

export const IHasEditModeDoc = new DocBuilder<IHasEditMode>({ name: 'mode' }).prop('mode', { examples: ['form', 'cell'], defaultValue: 'form' });

export * from '@epam/uui-docs';

import * as React from 'react';
import {
    basicPickerTogglerDoc, ColorPicker, DocBuilder, dropdownTogglerDoc, onClickDoc,
} from '@epam/uui-docs';
import { Badge, BadgeMods } from '@epam/promo';
import { FormContext, ResizableContext, DefaultContext } from '../../docs';
import { iconDoc, iconOptionsDoc } from '../../docs';
import { colors } from '../../docs/helpers/colorMap';
import { allEpamAdditionalColors } from '@epam/promo';
import { BadgeProps } from '@epam/promo';

const badgeDoc = new DocBuilder<BadgeProps & BadgeMods>({ name: 'Badge', component: Badge })
    .prop('color', {
        renderEditor: (editable, examples) => <ColorPicker colors={ examples.map((i) => ({ value: i, hex: colors[i] })) } { ...editable } />,
        examples: [...allEpamAdditionalColors, 'gray30'],
    })
    .implements([
        iconDoc, iconOptionsDoc, dropdownTogglerDoc, onClickDoc, basicPickerTogglerDoc,
    ])
    .prop('caption', {
        examples: [
            { value: 'Badge', isDefault: true }, { value: 'Status' }, { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' }, { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        ],
        type: 'string',
    })
    .prop('count', {
        examples: [
            0, 1, 5, 88, 123,
        ],
        defaultValue: 123,
    })
    .prop('fill', {
        examples: [
            'solid', 'semitransparent', 'transparent',
        ],
        defaultValue: 'solid',
    })
    .prop('size', {
        examples: [
            '18', '24', '30', '36', '42', '48',
        ],
        defaultValue: '36',
    })
    .withContexts(DefaultContext, FormContext, ResizableContext);

export default badgeDoc;

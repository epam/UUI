import { Badge, BadgeMods, BadgeProps } from '@epam/loveship';
import { basicPickerTogglerDoc, ColorPicker, DocBuilder, dropdownTogglerDoc, onClickDoc } from '@epam/uui-docs';
import { DefaultContext, FormContext, iconDoc, iconOptionsDoc, ResizableContext } from '../../docs';
import { allBorderStyles } from '@epam/loveship';
import { colors } from '../../docs/helpers/colorMap';
import * as React from 'react';

const badgeDoc = new DocBuilder<BadgeProps & BadgeMods>({ name: 'Badge', component: Badge })
    .implements([iconDoc, iconOptionsDoc, dropdownTogglerDoc, onClickDoc, basicPickerTogglerDoc])
    .prop('color', { renderEditor: (editable, examples) => <ColorPicker colors={ examples.map((i) => ({ value: i, hex: colors[i] })) } { ...editable } />,
        examples: ['sky', 'grass', 'sun', 'fire', 'yellow', 'orange', 'fuchsia', 'purple', 'lavanda', 'cobalt', 'white', 'night100', 'night300', 'night600'],
    })
    .prop('caption', {
        examples: [
            { value: 'Badge', isDefault: true }, { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' }, { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        ],
        type: 'string',
    })
    .prop('count', {
        examples: [
            0, 1, 5, 88, 123,
        ],
    })
    .prop('fill', {
        examples: [
            'solid', 'outline',
        ],
        defaultValue: 'solid',
    })
    .prop('shape', { examples: allBorderStyles, defaultValue: 'square' })
    .prop('size', {
        examples: [
            '12', '18', '24', '30', '36', '42', '48',
        ],
        defaultValue: '18',
    })
    .prop('indicator', {
        examples: [true, false], defaultValue: false,
    })
    .withContexts(DefaultContext, FormContext, ResizableContext);

export default badgeDoc;

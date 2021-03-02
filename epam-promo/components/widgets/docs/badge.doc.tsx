import * as React from 'react';
import { basicPickerTogglerDoc, ColorPicker, DocBuilder, dropdownTogglerDoc, onClickDoc } from '@epam/uui-docs';
import { Badge, BadgeMods } from '../Badge';
import { ButtonProps } from '@epam/uui-components';
import { FormContext, GridContext, ResizableContext, DefaultContext } from '../../../docs/index';
import { iconDoc, iconOptionsDoc } from '../../../docs';
import { colors } from '../../../helpers/colorMap';
import { allEpamAdditionalColors } from '../../types';

const badgeDoc = new DocBuilder<ButtonProps & BadgeMods>({ name: 'Badge', component: Badge })
    .prop('color', { renderEditor: (editable: any, examples) => <ColorPicker colors={ examples.map(i => ({ value: i, hex: colors[i] })) } { ...editable } />, examples: allEpamAdditionalColors })
    .implements([iconDoc, iconOptionsDoc, dropdownTogglerDoc, onClickDoc, basicPickerTogglerDoc] as any)
    .prop('caption', { examples: [
            { value: 'Badge', isDefault: true },
            { value: 'Status' },
            { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
            { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        ], type: 'string' })
    .prop('count', { examples: [0, 1, 5, 88, 123], defaultValue: 123 })
    .prop('fill', { examples: ['solid', 'semitransparent', 'transparent'], defaultValue: 'solid' })
    .prop('size', { examples : ['18', '24', '30', '36', '42'], defaultValue: '36' })
    .withContexts(DefaultContext, FormContext, ResizableContext,  GridContext);

export = badgeDoc;
import * as React from 'react';
import { IClickable, IDropdownToggler, IDisableable, IBasicPickerToggler, ICanBeInvalid, ICanRedirect, IHasLabel, IEditable, IHasPlaceholder, ICanBeReadonly } from '@epam/uui';
import { DocBuilder } from '../DocBuilder';

export const onClickDoc = new DocBuilder<IClickable>({ name: 'onClick' })
    .prop('onClick', { examples: ctx => [ctx.getCallback('onClick')] });

export const basicPickerTogglerDoc = new DocBuilder<IBasicPickerToggler>({ name: 'onClear' })
    .prop('onClear', { examples: ctx => [ctx.getCallback('onClear')] });

export const dropdownTogglerDoc = new DocBuilder<IDropdownToggler>({ name: 'Font' })
    .prop('isDropdown', { examples: [true] })
    .prop('isOpen', { examples: [true] });

export const isDisabledDoc = new DocBuilder<IDisableable>({ name: 'Font' })
    .prop('isDisabled', { description: "Disabled controls doesn't emit events like onClick", examples: [true] });

export const isReadonlyDoc = new DocBuilder<ICanBeReadonly>({ name: 'Font' })
    .prop('isReadonly', { examples: [true] });

export const isInvalidDoc = new DocBuilder<ICanBeInvalid>({ name: 'isInvalid'})
    .prop('isInvalid', { examples: [true] });

export const validationMessageDoc = new DocBuilder<ICanBeInvalid>({ name: 'validationMessage' })
    .prop('validationMessage', {
        examples: [
            { name: "Default", value: "This field is mandatory" },
            { name: "Long Message", value: "Sometimes messages are really long. It's expected that they will wrap to another line correctly. Wrapped text should still fit to grid." },
        ],
    });

export const iCanRedirectDoc = new DocBuilder<ICanRedirect>({ name: 'Icon' })
    .prop('link', { examples: [{ name: '/home', value: { pathname: '/home' } }]})
    .prop('isLinkActive', { examples: [true]})
    .prop('href', { examples: ['http://google.com'], type: 'string' })
    .prop('target', { examples: ['_blank'] });

export const iHasLabelDoc = new DocBuilder<IHasLabel>({ name: 'Label' })
    .prop('label', { examples:
    [
            { value: 'Some label', isDefault: true },
            { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
            { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    ], type: 'string' },
    );

export const iEditable = new DocBuilder<IEditable<any>>({ name: 'onValueChange' })
    .prop('onValueChange', { examples: ctx => [{ value: ctx.getChangeHandler('onValueChange'), name: '(newValue) => { ... }', isDefault: true }], isRequired: true });

export const iHasPlaceholder = new DocBuilder<IHasPlaceholder>({ name: 'placeholder' })
    .prop('placeholder', { examples: ['Select country', 'Type text'], type: 'string' });
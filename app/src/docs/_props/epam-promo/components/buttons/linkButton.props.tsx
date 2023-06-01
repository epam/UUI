import { LinkButton, deprecatedLinkButtonColors, allLinkButtonColors, LinkButtonProps } from '@epam/promo';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { onClickDoc, sizeDoc, dropdownTogglerDoc, isDisabledDoc, basicPickerTogglerDoc, iconWithInfoDoc, iconOptionsDoc, iCanRedirectDoc, DefaultContext, FormContext } from '../../docs';
import * as React from 'react';

const colors = {
    blue: '#007BBD',
    green: '#65A300',
    amber: '#FFC000',
    red: '#E54322',
    gray60: '#6C6F80',
    gray10: '#F5F6FA',
};

// lLinkButtonColors without deprecated colors
const actualLinkButtonColors = allLinkButtonColors.filter((val) => deprecatedLinkButtonColors.indexOf(val) === -1);

const LinkButtonDoc = new DocBuilder<LinkButtonProps>({ name: 'LinkButton', component: LinkButton })
    .implements([
        onClickDoc, sizeDoc, dropdownTogglerDoc, isDisabledDoc, basicPickerTogglerDoc, iconWithInfoDoc, iconOptionsDoc, iCanRedirectDoc,
    ])
    .prop('caption', {
        examples: [
            { value: 'Click Me', isDefault: true }, { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' }, { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        ],
        type: 'string',
    })
    .prop('color', { renderEditor: (editable: any, examples) => <ColorPicker colors={ examples.map((i) => ({ value: i, hex: colors[i] })) } { ...editable } />, examples: actualLinkButtonColors })
    .withContexts(DefaultContext, FormContext);

export default LinkButtonDoc;

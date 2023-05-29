import { allLinkButtonColors, LinkButton, LinkButtonProps } from '@epam/loveship';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { DefaultContext, FormContext } from '../../docs';
import { onClickDoc, sizeDoc, dropdownTogglerDoc, isDisabledDoc, basicPickerTogglerDoc, iconWithInfoDoc, iconOptionsDoc, iCanRedirectDoc } from '../../docs';
import { colors } from '../../docs/helpers/colorMap';
import * as React from 'react';

const LinkButtonDoc = new DocBuilder<LinkButtonProps>({ name: 'LinkButton', component: LinkButton })
    .implements([onClickDoc, sizeDoc, dropdownTogglerDoc, isDisabledDoc, basicPickerTogglerDoc, iconWithInfoDoc, iconOptionsDoc, iCanRedirectDoc])
    .prop('color', {
        renderEditor: (editable, examples) => <ColorPicker colors={ examples.map((i) => ({ value: i, hex: colors[i] })) } { ...editable } />,
        examples: allLinkButtonColors,
    })
    .prop('caption', {
        examples: [
            { value: 'Click Me', isDefault: true }, { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' }, { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        ],
        type: 'string',
    })
    .withContexts(DefaultContext, FormContext);

export default LinkButtonDoc;

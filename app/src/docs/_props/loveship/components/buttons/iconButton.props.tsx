import * as React from 'react';
import { IconButton, IconButtonProps } from '@epam/loveship';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { onClickDoc, isDisabledDoc, iCanRedirectDoc, iconDoc, DefaultContext, FormContext } from '../../docs';
import { colors } from '../../docs/helpers/colorMap';

const IconButtonDoc = new DocBuilder<IconButtonProps>({ name: 'IconButton', component: IconButton })
    .implements([
        onClickDoc, isDisabledDoc, iCanRedirectDoc, iconDoc,
    ])
    .prop('color', {
        renderEditor: (editable, examples) => <ColorPicker colors={ examples.map((i) => ({ value: i, hex: colors[i] })) } { ...editable } />,
        examples: ['sky', 'grass', 'sun', 'fire', 'cobalt', 'violet', 'fuchsia', 'white', 'night500', 'night600'],
    })
    .withContexts(DefaultContext, FormContext);

export default IconButtonDoc;

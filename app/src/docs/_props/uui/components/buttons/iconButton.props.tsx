import * as React from 'react';
import { allIconColors, IconButton, IconButtonProps } from '@epam/uui';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { onClickDoc, isDisabledDoc, iCanRedirectDoc, iconDoc } from '../../docs';
import { DefaultContext } from '../../docs';

const IconButtonDoc = new DocBuilder<IconButtonProps>({ name: 'IconButton', component: IconButton })
    .implements([
        onClickDoc, isDisabledDoc, iCanRedirectDoc, iconDoc,
    ])
    .prop('color', { renderEditor: (editable: any, examples) => <ColorPicker colors={ examples.map((i) => ({ value: i })) } { ...editable } />, examples: allIconColors })
    .withContexts(DefaultContext);

export default IconButtonDoc;

import * as React from 'react';
import { allIconColors, IconButton, IconButtonProps } from './IconButton';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { onClickDoc, isDisabledDoc, iCanRedirectDoc, isInvalidDoc } from '../../../docs';
import { DefaultContext } from '../../../docs';

const IconButtonDoc = new DocBuilder<IconButtonProps>({ name: 'IconButton', component: IconButton })
    .implements([onClickDoc, isDisabledDoc, isInvalidDoc, iCanRedirectDoc])
    .prop('color', { renderEditor: (editable: any, examples) => <ColorPicker colors={ examples.map(i => ({ value: i })) } { ...editable } />, examples: allIconColors })
    .withContexts(DefaultContext);

export = IconButtonDoc;
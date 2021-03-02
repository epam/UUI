import React from 'react';
import { allIconColors, IconButton, IconButtonProps } from '../IconButton';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { onClickDoc, isDisabledDoc, iCanRedirectDoc, iconDoc, isInvalidDoc } from '../../../docs';
import { DefaultContext, FormContext } from '../../../docs';
import { colors } from '../../../helpers/colorMap';

const IconButtonDoc = new DocBuilder<IconButtonProps>({ name: 'IconButton', component: IconButton as React.ComponentClass<IconButtonProps> })
    .implements([onClickDoc, isDisabledDoc, isInvalidDoc, iCanRedirectDoc, iconDoc] as any)
    .prop('color', { renderEditor: (editable: any, examples) => <ColorPicker colors={ examples.map(i => ({ value: i, hex: colors[i] })) } { ...editable } />, examples: allIconColors })
    .withContexts(DefaultContext, FormContext);

export = IconButtonDoc;
import * as React from 'react';
import { allIconColors, deprecatedIconButtonColors, EpamColor, IconButton, IconButtonProps } from '@epam/loveship';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { onClickDoc, isDisabledDoc, iCanRedirectDoc, iconDoc, isInvalidDoc, DefaultContext, FormContext } from '../../docs';
import { colors } from '../../docs/helpers/colorMap';

// IconButtonColors without deprecated colors
const ActualIconButtonColors: EpamColor[] = allIconColors.filter((val) => deprecatedIconButtonColors.indexOf(val) === -1);

const IconButtonDoc = new DocBuilder<IconButtonProps>({ name: 'IconButton', component: IconButton })
    .implements([
        onClickDoc, isDisabledDoc, isInvalidDoc, iCanRedirectDoc, iconDoc,
    ])
    .prop('color', {
        renderEditor: (editable, examples) => <ColorPicker colors={ examples.map((i) => ({ value: i, hex: colors[i] })) } { ...editable } />,
        examples: ActualIconButtonColors,
    })
    .withContexts(DefaultContext, FormContext);

export default IconButtonDoc;

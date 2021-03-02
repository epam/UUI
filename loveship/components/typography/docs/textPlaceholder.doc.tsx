import React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { TextPlaceholder, TextPlaceholderProps } from '../TextPlaceholder';
import { DefaultContext, ResizableContext, FormContext, GridContext, ColorPicker } from '../../../docs';
import { allEpamPrimaryColors, allEpamAdditionalColors, allEpamGrayscaleColors  } from '../../types';
import { colors } from "../../../helpers/colorMap";

const textPlaceholderDoc = new DocBuilder<TextPlaceholderProps>({ name: 'TextPlaceholder', component: TextPlaceholder })
    .prop('wordsCount', { examples: [2, 3, 4, 5, 6, 12, 150] })
    .prop('color', {
        examples: [...allEpamPrimaryColors, ...allEpamAdditionalColors, ...allEpamGrayscaleColors],
        renderEditor: (editable: any, examples) => <ColorPicker colors={ examples.map(i => ({ value: i, hex: colors[i] })) } { ...editable } />,
        defaultValue: 'night50',
    })
    .prop('isNotAnimated', { examples: [true, false] })
    .withContexts(DefaultContext, ResizableContext, FormContext, GridContext);

export = textPlaceholderDoc;
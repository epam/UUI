import React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { TextPlaceholder, TextPlaceholderProps } from '@epam/loveship';
import { DefaultContext, ResizableContext, FormContext, ColorPicker } from '../../docs';
import { allEpamPrimaryColors, allEpamAdditionalColors, allEpamGrayscaleColors } from '@epam/loveship';
import { colors } from '../../docs/helpers/colorMap';

const textPlaceholderDoc = new DocBuilder<TextPlaceholderProps>({ name: 'TextPlaceholder', component: TextPlaceholder })
    .prop('wordsCount', { examples: [2, 3, 4, 5, 6, 12, 150] })
    .prop('color', {
        examples: [...allEpamPrimaryColors, ...allEpamAdditionalColors, ...allEpamGrayscaleColors],
        renderEditor: (editable, examples) => <ColorPicker colors={examples.map(i => ({ value: i, hex: colors[i] }))} {...editable} />,
        defaultValue: 'night100',
    })
    .prop('isNotAnimated', { examples: [true, false] })
    .withContexts(DefaultContext, ResizableContext, FormContext);

export default textPlaceholderDoc;

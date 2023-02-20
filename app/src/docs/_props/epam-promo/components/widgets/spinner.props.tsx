import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { SpinnerProps } from '@epam/uui-components';
import { allSpinnerColors, Spinner, SpinnerMods } from '@epam/promo';
import { FormContext, DefaultContext, ResizableContext } from '../../docs';
import { colors } from '../../docs/helpers/colorMap';
import * as React from 'react';

const spinnerDoc = new DocBuilder<SpinnerProps & SpinnerMods>({ name: 'Spinner', component: Spinner })
    .prop('color', {
        renderEditor: (editable, examples) => <ColorPicker colors={examples.map(i => ({ value: i, hex: colors[i] }))} {...editable} />,
        examples: allSpinnerColors,
    })
    .withContexts(DefaultContext, FormContext, ResizableContext);

export default spinnerDoc;

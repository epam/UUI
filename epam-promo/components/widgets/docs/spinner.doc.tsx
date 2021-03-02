import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { SpinnerProps } from '@epam/uui-components';
import { allSpinnerColors, Spinner, SpinnerMods } from '../Spinner';
import { FormContext, DefaultContext, ResizableContext, GridContext } from '../../../docs';
import { colors } from '../../../helpers/colorMap';
import * as React from 'react';

const spinnerDoc = new DocBuilder<SpinnerProps & SpinnerMods>({ name: 'Spinner', component: Spinner })
    .prop('color', { renderEditor:  (editable: any, examples) => <ColorPicker colors={ examples.map(i => ({ value: i, hex: colors[i] })) } { ...editable } />, examples: allSpinnerColors })
    .withContexts(DefaultContext, FormContext, ResizableContext, GridContext);

export = spinnerDoc;
import * as React from 'react';
import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { RadioInputProps } from '@epam/uui-components';
import { RadioInput, RadioInputMods } from '../RadioInput';
import { isDisabledDoc, isInvalidDoc, iHasLabelDoc, iEditable } from '../../../docs';
import { DefaultContext, FormContext } from '../../../docs';

const RadioInputDoc = new DocBuilder<RadioInputProps & RadioInputMods>({ name: 'RadioInput', component: RadioInput as React.ComponentClass<any> })
    .implements([isDisabledDoc, isReadonlyDoc, isInvalidDoc, iHasLabelDoc, iEditable] as any)
    .prop('value', { examples: [true, false] })
    .prop('size', { examples: ['12', '18'] })
    .withContexts(DefaultContext, FormContext);

export = RadioInputDoc;
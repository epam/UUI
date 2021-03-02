import * as React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { CheckboxProps } from '@epam/uui-components';
import { Checkbox, CheckboxMods } from '../Checkbox';
import { isDisabledDoc, isInvalidDoc, iHasLabelDoc, iEditable } from '../../../docs';
import { DefaultContext, FormContext } from '../../../docs';

const CheckboxDoc = new DocBuilder<CheckboxProps & CheckboxMods>({ name: 'Checkbox', component: Checkbox as React.ComponentClass<any> })
    .implements([isDisabledDoc, isInvalidDoc, iHasLabelDoc, iEditable] as any)
    .prop('value', { examples: [true, false] })
    .prop('size', { examples: ['12', '18'], defaultValue: '18' })
    .prop('indeterminate', { examples: [true, false], defaultValue: false })
    .withContexts(DefaultContext, FormContext);

export = CheckboxDoc;
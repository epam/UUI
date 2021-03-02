import * as React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { SwitchProps } from '@epam/uui-components';
import { Switch, SwitchMods } from '../Switch';
import { isDisabledDoc, iHasLabelDoc, iEditable, colorDoc } from '../../../docs';
import { DefaultContext, ResizableContext, FormContext, GridContext } from '../../../docs';

const SwitchDoc = new DocBuilder<SwitchProps & SwitchMods>({ name: 'Switch', component: Switch as React.ComponentClass<any>})
    .implements([isDisabledDoc, iHasLabelDoc, iEditable, colorDoc] as any)
    .prop('theme', { examples: (['light', 'dark']), defaultValue: 'light' })
    .prop('size', { examples: ['12', '18', '24'], defaultValue: '18' })
    .prop('value', { examples: [true, false], defaultValue: false })
    .withContexts(DefaultContext, ResizableContext, FormContext, GridContext);

export = SwitchDoc;
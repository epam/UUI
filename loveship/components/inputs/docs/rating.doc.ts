import * as React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { RatingProps } from '@epam/uui-components';
import { Rating, RatingMods } from '../Rating';
import { isDisabledDoc, isInvalidDoc, colorDoc, iEditable, DefaultContext, FormContext, GridContext } from '../../../docs';

const RatingDoc = new DocBuilder<RatingProps & RatingMods>({ name: 'Rating', component: Rating as React.ComponentClass<any> })
    .implements([isDisabledDoc, isInvalidDoc, iEditable, colorDoc] as any)
    .prop('size', { examples: [18, 24, 30], defaultValue: 18 })
    .prop('value', { examples: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] })
    .prop('step', { examples: [0.5, 1], defaultValue: 1 })
    .prop('isReadonly', { examples: [true] })
    .prop('hideTooltip', { examples: [true] })
    .prop('hint', { examples: [{ name: 'hint', value: (val: number) => `now is ${val} stars` }] })
    .withContexts(DefaultContext, FormContext, GridContext);

export = RatingDoc;
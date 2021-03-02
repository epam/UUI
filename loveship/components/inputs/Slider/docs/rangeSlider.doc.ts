import { DocBuilder } from '@epam/uui-docs';
import { SliderBaseProps, RangeSliderValue } from '@epam/uui-components';
import { RangeSlider, RangeSliderMods } from '../RangeSlider';
import { DefaultContext, GridContext, FormContext, colorDoc, iEditable, isDisabledDoc } from '../../../../docs';

const rangeSliderDoc = new DocBuilder<SliderBaseProps<RangeSliderValue> & RangeSliderMods>({ name: 'RangeSlider', component: RangeSlider })
    .implements([colorDoc, iEditable, isDisabledDoc] as any)
    .prop('value', { examples: [{ value: { from: 10, to: 100 }, name: '{ from: 10, to: 100 }' }, { value: { from: 25, to: 55 }, name: '{ from: 25, to: 55 }' }], isRequired: true })
    .prop('min', { examples: [1, 0, 100], isRequired: true })
    .prop('max', { examples: [200, 300], isRequired: true })
    .prop('step', { examples: [1, 5, 10], isRequired: true })
    .prop('splitAt', { examples: [2, 10, 20, { value: 50, isDefault: true }], defaultValue: 50 })
    .withContexts(DefaultContext, FormContext, GridContext);

export = rangeSliderDoc;
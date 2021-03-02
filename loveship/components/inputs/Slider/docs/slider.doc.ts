import { DocBuilder } from '@epam/uui-docs';
import { SliderBaseProps } from '@epam/uui-components';
import { Slider, SliderMods } from '../Slider';
import { DefaultContext, FormContext, GridContext, ResizableContext, colorDoc, iEditable, isDisabledDoc } from '../../../../docs';

const sliderDoc = new DocBuilder<SliderBaseProps<number> & SliderMods>({ name: 'Slider', component: Slider })
    .implements([colorDoc, iEditable, isDisabledDoc] as any)
    .prop('value', { examples: [10, 20, 50], isRequired: true })
    .prop('min', { examples: [{value: 0, isDefault: true}, 1, 50], isRequired: true })
    .prop('max', { examples: [100, 200, 300], isRequired: true })
    .prop('step', { examples: [1, 5, 10, 25, 50], isRequired: true })
    .prop('splitAt', { examples: [2, 10, 20, { value: 25, isDefault: true }, 50], defaultValue: 50 })
    .prop('showTooltip', { examples: [false] })
    .prop('renderLabel', {
        examples: [
            { name: 'Label', value: (value: number) =>  {
                    return value + "%";
                } },
        ],
        isRequired: false,
    })
    .withContexts(DefaultContext, ResizableContext, FormContext, GridContext);

export = sliderDoc;

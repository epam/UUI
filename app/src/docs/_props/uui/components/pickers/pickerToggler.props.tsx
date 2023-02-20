import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { PickerTogglerProps } from '@epam/uui-components';
import { iEditable, isDisabledDoc, iconOptionsDoc, dropdownTogglerDoc } from '../../docs';
import { DefaultContext, IHasEditModeDoc } from '../../docs';
import { PickerToggler, PickerTogglerMods } from '@epam/uui';

const PickerTogglerDoc = new DocBuilder<PickerTogglerProps<any, any> & PickerTogglerMods>({ name: 'PickerToggler', component: PickerToggler })
    .prop('size', { examples: ['24', '30', '36', '42'], defaultValue: '36' })
    .implements([isDisabledDoc, isReadonlyDoc, iconOptionsDoc, dropdownTogglerDoc, iEditable, IHasEditModeDoc])
    .prop('selection', {
        examples: [
            { name: 'Tags', value: [{ value: '.Net' }, { value: 'JS' }, { value: 'React' }], isDefault: true },
            {
                name: 'Names',
                value: [
                    { value: 'Alvaro De Matos Miranda Filho' },
                    { value: 'Janaina Barreiro Gambaro Bueno' },
                    { value: 'Mindaugas Krapauskas' },
                    { value: 'Patrick Magenheimer' },
                ],
            },
            {
                name: 'Languages',
                value: [
                    { value: 'Belarusian' },
                    { value: 'Russian' },
                    { value: 'German' },
                    { value: 'Spanish' },
                    { value: 'English' },
                    { value: 'French' },
                ],
            },
        ] as any,
    })
    .prop('pickerMode', { examples: ['single'], defaultValue: 'multi' })
    .prop('maxItems', { examples: [0, 1, 5, 10, 50, 100, 1000] })
    .prop('isInvalid', { examples: [true] })
    .prop('isSingleLine', { examples: [true] })
    .prop('placeholder', { examples: ['Select Country', 'Select Person'], type: 'string', defaultValue: 'Please select' })
    .withContexts(DefaultContext);

export default PickerTogglerDoc;

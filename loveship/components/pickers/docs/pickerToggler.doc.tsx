import * as React from 'react';
import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { PickerTogglerProps } from '@epam/uui-components';
import { iEditable, sizeDoc, isDisabledDoc, iconDoc, iconOptionsDoc, dropdownTogglerDoc, modeDoc } from '../../../docs';
import { DefaultContext, ResizableContext, FormContext } from '../../../docs';
import { PickerToggler } from '../PickerToggler';
import { Button } from '../../buttons';

const PickerTogglerDoc = new DocBuilder<PickerTogglerProps<any, any>>({ name: 'PickerToggler', component: PickerToggler })
    .implements([sizeDoc, isDisabledDoc, isReadonlyDoc, iconDoc, iconOptionsDoc, dropdownTogglerDoc, iEditable, modeDoc])
    .prop('selection', { examples: [
        { name:'Tags', value: [{ value: '.Net' }, { value: 'JS' }, { value: 'React' }], isDefault: true },
        { name:'Names', value: [{ value: 'Alvaro De Matos Miranda Filho' }, { value: 'Janaina Barreiro Gambaro Bueno' }, { value: 'Mindaugas Krapauskas' }, { value: 'Patrick Magenheimer' }] },
        { name:'Languages', value: [{ value: 'Belarusian' }, { value: 'Russian' }, { value: 'German' }, { value: 'Spanish' }, { value: 'English' }, { value: 'French' }] },
    ] as any })
    .prop('pickerMode', { examples: ['single'], defaultValue: 'multi' })
    .prop('maxItems', { examples: [0, 1, 5, 10, 50, 100, 1000] })
    .prop('isInvalid', { examples: [true] })
    .prop('isSingleLine', { examples: [true] })
    .prop('placeholder', { examples: ['Select Country', 'Select Person'], type: 'string', defaultValue: 'Please select' })
    .prop('renderItem', { examples: [{ name: 'Night Button', value: row =>
        <Button
            key={ row.value }
            caption={ row.value }
            color="night700"
            size='30'
            onClear={ () => {} }
        />,
    }] })
    .withContexts(DefaultContext, ResizableContext, FormContext);

export default PickerTogglerDoc;

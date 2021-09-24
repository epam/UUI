import * as React from 'react';
import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { Autocomplete, AutocompleteInputProps } from '../Autocomplete';
import { iEditable, isDisabledDoc } from '../../../docs';
import { DefaultContext, ResizableContext, IHasEditModeDoc, FormContext, TableContext } from '../../../docs';
import { getDataSourceExamples } from '../../pickers/docs/common';

const AutocompleteDoc = new DocBuilder<AutocompleteInputProps<any, any>>({ name: 'Autocomplete', component: Autocomplete })
    .implements([isDisabledDoc, isReadonlyDoc, iEditable, IHasEditModeDoc] as any)
    .prop('size', { examples: ['24', '30', '36', '42', '48'], defaultValue: '36' })
    .prop('value', { examples: ['A1']})
    .prop('dataSource', { examples: getDataSourceExamples, isRequired: true })
    .prop('getName', {
        examples: [
            { name: 'i => i.name', value: (i: any) => i.name },
            { name: 'i => i.level', value: (i: any) => i.level },
        ],
    })
    .prop('entityName', { examples: ['Language', 'City', 'Role', 'Location', 'Person'] })
    .prop('minCharsToSearch', { examples: [1, 3, 5], defaultValue: 1 })
    .prop('isInvalid', { examples: [true] })
    .prop('placeholder', { examples: ['Select Country', 'Select Person'], type: 'string', defaultValue: 'Please select' })
    .prop('minBodyWidth', { examples: [100, 150, 200, 250, 300, 360, 400], defaultValue: 360 })
    .prop('dropdownHeight', { examples: [100, 200, 300], defaultValue: 300 })
    .prop('disableClear', { examples: [true], defaultValue: false})
    .withContexts(DefaultContext, ResizableContext, FormContext, TableContext);

export = AutocompleteDoc;

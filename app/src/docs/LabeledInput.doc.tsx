import * as React from 'react';
import * as uui from '@epam/uui';
import * as promo from '@epam/promo';
import * as loveship from '@epam/loveship';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class LabeledInputDoc extends BaseDocsBlock {
    title = 'Labeled Input';

    static override config: TDocConfig = {
        name: 'LabeledInput',
        contexts: [TDocContext.Default, TDocContext.Resizable, TDocContext.Form],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:LabeledInputProps', component: uui.LabeledInput },
            [TSkin.Electric]: { type: '@epam/uui:LabeledInputProps', component: electric.LabeledInput },
            [TSkin.Loveship]: { type: '@epam/uui:LabeledInputProps', component: loveship.LabeledInput },
            [TSkin.Promo]: { type: '@epam/uui:LabeledInputProps', component: promo.LabeledInput },
        },
        doc: (doc: DocBuilder<uui.LabeledInputProps>) => {
            doc.merge('value', { examples: ['Some simple text'] });
            doc.merge('Tooltip', { examples: [{ value: uui.Tooltip, name: 'Tooltip', isDefault: true }], isRequired: true });
            doc.merge('size', { defaultValue: '36' });
            doc.merge('labelPosition', { defaultValue: 'top' });
            doc.merge('children', {
                examples: [
                    { name: 'TextInput 48', value: <uui.TextInput value="text" size="48" onValueChange={ () => {} } /> },
                    { name: 'TextInput 36', value: <uui.TextInput value="text" onValueChange={ () => {} } />, isDefault: true },
                    { name: 'TextInput 30', value: <uui.TextInput value="text" size="30" onValueChange={ () => {} } /> },
                    { name: 'TextInput 24', value: <uui.TextInput value="text" size="24" onValueChange={ () => {} } /> },
                    { name: 'Checkbox', value: <uui.Checkbox value={ true } onValueChange={ () => {} } /> },
                    { name: 'Slider', value: <uui.Slider min={ 0 } max={ 100 } value={ 50 } onValueChange={ () => {} } step={ 5 } /> },
                ],
            });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="labeledInput-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/labeledInput/Basic.example.tsx" />
            </>
        );
    }
}

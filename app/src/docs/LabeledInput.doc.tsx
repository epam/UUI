import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, TSkin,
} from '../common';
import { TDocConfig } from '../common/docs/docBuilderGen/types';
import { DocBuilder } from '@epam/uui-docs';
import * as loveshipDocs from './_props/loveship/docs';
import * as promoDocs from './_props/epam-promo/docs';
import * as uui from '@epam/uui';
import * as promo from '@epam/promo';

export class LabeledInputDoc extends BaseDocsBlock {
    title = 'Labeled Input';

    override config: TDocConfig = {
        name: 'LabeledInput',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:LabeledInputProps', component: uui.LabeledInput },
            [TSkin.UUI3_loveship]: {
                type: '@epam/uui:LabeledInputProps',
                component: uui.LabeledInput,
                doc: (doc: DocBuilder<uui.LabeledInputProps>) => doc.withContexts(loveshipDocs.FormContext, loveshipDocs.ResizableContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/uui:LabeledInputProps',
                component: uui.LabeledInput,
                doc: (doc: DocBuilder<uui.LabeledInputProps>) => doc.withContexts(promoDocs.FormContext, promoDocs.ResizableContext),
            },
        },
        doc: (doc: DocBuilder<uui.LabeledInputProps>) => {
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
                    { name: 'Slider', value: <promo.Slider min={ 0 } max={ 100 } value={ 50 } onValueChange={ () => {} } step={ 5 } /> },
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

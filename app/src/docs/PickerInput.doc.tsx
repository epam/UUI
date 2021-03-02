import * as React from 'react';
import { BaseDocsBlock, EditableDocContent, DocExample, UUI4, UUI3 } from "../common/docs";

export class PickerInputDoc extends BaseDocsBlock {
    title = 'Picker Input';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/pickers/docs/pickerInput.doc.tsx',
            [UUI4]: './epam-promo/components/pickers/docs/pickerInput.doc.tsx',
        };
    }

    renderContent(): React.ReactNode {
        return (
            <>
                <EditableDocContent fileName='pickerInput-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/pickerInput/ArrayPickerInput.example.tsx'
                />
                <DocExample
                    title='Lazy list'
                    path='./examples/pickerInput/LazyPickerInput.example.tsx'
                />
                <DocExample
                    title='Lazy tree'
                    path='./examples/pickerInput/LazyTreeInput.example.tsx'
                />
                <DocExample
                    title='Async list'
                    path='./examples/pickerInput/AsyncPickerInput.example.tsx'
                />
                <DocExample
                    title='Search positions'
                    path='./examples/pickerInput/SearchPositions.example.tsx'
                />
                <DocExample
                    title='Custom picker row'
                    path='./examples/pickerInput/CustomUserRow.example.tsx'
                />
                <DocExample
                    title='Setting row options'
                    path='./examples/pickerInput/GetRowOptions.example.tsx'
                />
                <DocExample
                    title='Getting selected entity'
                    path='./examples/pickerInput/ValueType.example.tsx'
                />
                <DocExample
                    title='Picker toggler configuration and options'
                    path='./examples/pickerInput/TogglerConfiguration.example.tsx'
                />
                <DocExample
                    title='Open picker in modal'
                    path='./examples/pickerInput/EditMode.example.tsx'
                />
                <DocExample
                    title='Picker with changed array of items'
                    path='./examples/pickerInput/PickerWithChangingItemsArray.example.tsx'
                />
                <DocExample
                    title='Linked pickers'
                    path='./examples/pickerInput/LinkedPickers.example.tsx'
                />
            </>
        );
    }
}
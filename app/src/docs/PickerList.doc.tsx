import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4 } from '../common';

export class PickerListDoc extends BaseDocsBlock {
    title = 'PickerList';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/pickers/docs/pickerList.doc.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='pickerList-description' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/pickerList/Basic.example.tsx'
                />
            </>
        );
    }
}
import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common/docs';

export class FormDoc extends BaseDocsBlock {
    title = 'Form';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='form-descriptions' />

                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/form/Basic.example.tsx'
                />

                <DocExample
                    title='Advanced'
                    path='./examples/form/Advanced.example.tsx'
                />

                <DocExample
                    title='Modal with Form'
                    path='./examples/modals/ModalWithForm.example.tsx'
                />
                
                <DocExample
                    title='Server-side validation'
                    path='./examples/form/ServerValidation.example.tsx'
                />
            </>
        );
    }
}

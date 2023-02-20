import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common/docs';

export class FormDoc extends BaseDocsBlock {
    title = 'Form';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="form-descriptions" />

                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/form/Basic.example.tsx" />

                <DocExample title="Advanced" path="./_examples/form/Advanced.example.tsx" />

                <DocExample title="Modal with Form" path="./_examples/modals/ModalWithForm.example.tsx" />

                <DocExample title="Server-side validation" path="./_examples/form/ServerValidation.example.tsx" />

                <DocExample title="Usage with class components" path="./_examples/form/FormWIthClasses.example.tsx" />

                <DocExample title='Usage with validateOn: "onchange" ' path="./_examples/form/FormValidateOnChange.example.tsx" />
            </>
        );
    }
}

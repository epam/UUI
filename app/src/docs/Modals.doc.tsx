import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../common';

export class ModalsDoc extends BaseDocsBlock {
    title = 'Modals';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="modals-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/modals/Basic.example.tsx" />

                <DocExample title="Modal with Form" path="./_examples/modals/ModalWithForm.example.tsx" />

                <DocExample
                    title="Disable close on click outside modal and modal header cross disabling"
                    path="./_examples/modals/DisableClickOutsideAndCross.example.tsx"
                />
            </>
        );
    }
}

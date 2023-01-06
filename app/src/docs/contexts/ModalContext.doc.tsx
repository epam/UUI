import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../../common';

export class ModalContextDoc extends BaseDocsBlock {
    title = 'Modal Context';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='modal-context-descriptions' />
                <DocExample
                    title='Example'
                    path='./_examples/contexts/ModalContext.example.tsx'
                />
            </>
        );
    }
}

import * as React from 'react';
import { EditableDocContent, BaseDocsBlock, DocExample } from '../../common';

export class DragAndDropDoc extends BaseDocsBlock {
    title = 'Drag and Drop';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='DragAndDrop-intro' />

                <DocExample
                    title='Basic'
                    path='./examples/dnd/Basic.example.tsx'
                />
            </>
        );
    }
}

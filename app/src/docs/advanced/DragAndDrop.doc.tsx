import * as React from 'react';
import { EditableDocContent, BaseDocsBlock, DocExample } from '../../common';

export class DragAndDropDoc extends BaseDocsBlock {
    title = 'Drag and Drop';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="DragAndDrop-intro" />

                <DocExample title="Basic" path="./_examples/dnd/Basic.example.tsx" />

                <EditableDocContent fileName="DragAndDrop-stateManagement" />
            </>
        );
    }
}

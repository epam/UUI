import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class RichTextEditorDoc extends BaseDocsBlock {
    title = 'Rich Text Editor';


    renderContent() {
        return (
            <>
                <DocExample
                    path='./examples/richTextEditor/Basic.example.tsx'
                />
            </>
        );
    }
}

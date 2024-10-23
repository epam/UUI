import * as React from 'react';
import { BaseDocsBlock, DocExample } from '../common';

export class RichTextEditorSerializersDoc extends BaseDocsBlock {
    title = 'Rich Text Editor Serializers';
    renderContent() {
        return (
            <>
                <DocExample title="MD format" path="./_examples/richTextEditor/MdSerialization.example.tsx" />
                <DocExample title="HTML format" path="./_examples/richTextEditor/HtmlSerialization.example.tsx" />
            </>
        );
    }
}

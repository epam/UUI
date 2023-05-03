import * as React from 'react';
import { BaseDocsBlock, DocExample } from '../common';

export class RichTextEditorDoc extends BaseDocsBlock {
    title = 'Rich Text Editor';
    renderContent() {
        return (
            <>
                <DocExample path="./_examples/richTextEditor/Basic.example.tsx" />
                <DocExample title="Inner scroll behavior" path="./_examples/richTextEditor/WithInnerScroll.example.tsx" />
            </>
        );
    }
}

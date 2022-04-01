import * as React from 'react';
import { BaseDocsBlock, DocExample } from '../common';

export class RichTextEditorDoc extends BaseDocsBlock {
    title = 'Rich Text Editor';


    renderContent() {
        return (
            <>
                <DocExample
                    path='./examples/richTextEditor/Basic.example.tsx'
                />
                <DocExample
                    title='Inner scroll behavior'
                    path='./examples/richTextEditor/WithInnerScroll.example.tsx'
                />
            </>
        );
    }
}

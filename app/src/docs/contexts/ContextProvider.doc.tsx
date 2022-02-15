import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../../common';

export class ContextProviderDoc extends BaseDocsBlock {
    title = 'UUI Context Provider';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='context-provider-descriptions' />
                <DocExample
                    title='Example'
                    path='./examples/contexts/ContextProvider.example.tsx'
                    onlyCode={ true }
                />

                <DocExample
                    title='Example with hook'
                    path='./examples/contexts/UseUuiServices.example.tsx'
                    onlyCode={ true }
                />
            </>
        );
    }
}
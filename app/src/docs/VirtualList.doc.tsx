import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4 } from '../common';

export class VirtualListDoc extends BaseDocsBlock {
    title = 'VirtualList';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='virtual-list-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/virtualList/Basic.example.tsx'
                />

                <DocExample
                    title='Advanced'
                    path='./examples/virtualList/Advanced.example.tsx'
                />
            </>
        );
    }
}
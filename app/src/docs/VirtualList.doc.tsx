import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock,
} from '../common';

export class VirtualListDoc extends BaseDocsBlock {
    title = 'VirtualList';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="virtual-list-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/virtualList/Basic.example.tsx" />
                {/* <DocExample title="Scroll to index" path="./_examples/virtualList/ScrollTo.example.tsx" />
                <DocExample title="Advanced" path="./_examples/virtualList/Advanced.example.tsx" /> */}
            </>
        );
    }
}

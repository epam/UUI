import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock,
} from '../common';

export class TreeDoc extends BaseDocsBlock {
    title = 'Tree';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="tree-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/dataSources/CustomHierarchicalList.example.tsx" />
            </>
        );
    }
}

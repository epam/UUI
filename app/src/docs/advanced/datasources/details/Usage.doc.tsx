import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../../../common';

export class DatasourcesUsageDoc extends BaseDocsBlock {
    title = 'Usage in components';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="datasources-usage-in-components" />

                <DocExample title="DatasourceViewer" path="./_examples/datasources/DatasourceViewer.tsx" onlyCode={ true } />
            </>
        );
    }
}

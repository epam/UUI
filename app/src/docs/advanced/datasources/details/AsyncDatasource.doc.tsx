import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../../../common';

export class DatasourcesAsyncDatasourceDoc extends BaseDocsBlock {
    title = 'AsyncDatasource';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="datasources-Async-datasource" />
                <DocExample title="Data" path="./_examples/datasources/AsyncDatasourceData.example.tsx" />
            </>
            
        );
    }
}

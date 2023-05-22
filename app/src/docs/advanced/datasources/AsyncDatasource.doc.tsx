import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../../common';

export class DatasourcesAsyncDatasourceDoc extends BaseDocsBlock {
    title = 'AsyncDatasource';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="datasources-Async-datasource" />

                <DocExample title="AsyncDatasourceProps" path="./_examples/datasources/AsyncDatasourceProps.code.example.ts" onlyCode={ true } />
                <EditableDocContent fileName="datasources-async-datasource-props-overview" />

                <DocExample title="useAsyncDataSource" path="./_examples/datasources/UseAsyncDataSource.code.example.ts" onlyCode={ true } />

                <DocExample title="Data" path="./_examples/datasources/AsyncDatasourceData.example.tsx" />
            </>
            
        );
    }
}

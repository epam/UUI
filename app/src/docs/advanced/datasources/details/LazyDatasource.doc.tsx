import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../../../common';

export class DatasourcesLazyDatasourceDoc extends BaseDocsBlock {
    title = 'LazyDatasource';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="datasources-lazy-datasource" />

                <DocExample title="LazyDatasourceProps" path="./_examples/datasources/LazyDatasourceProps.code.example.ts" onlyCode={ true } />
                <EditableDocContent fileName="datasources-base-props-overview" />

                <DocExample title="LazyDataSourceApi" path="./_examples/datasources/LazyDataSourceApi.code.example.ts" onlyCode={ true } />
                <EditableDocContent fileName="datasources-lazy-api-overview" />

                <DocExample title="Data" path="./_examples/datasources/LazyDatasourceData.example.tsx" />
                <DocExample title="getChildCount" path="./_examples/datasources/LazyDatasourceGetChildCount.example.tsx" />
                <DocExample title="Filter" path="./_examples/datasources/LazyDatasourceFilter.example.tsx" />

            </>
        );
    }
}

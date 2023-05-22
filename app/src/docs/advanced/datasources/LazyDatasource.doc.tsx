import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../../common';

export class DatasourcesLazyDatasourceDoc extends BaseDocsBlock {
    title = 'LazyDatasource';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="datasources-lazy-datasource" />

                <DocExample title="LazyDatasourceProps" path="./_examples/datasources/LazyDatasourceProps.code.example.ts" onlyCode={ true } />
                <EditableDocContent fileName="datasources-lazy-datasource-props-overview" />

                <DocExample title="useLazyDataSource" path="./_examples/datasources/UseLazyDataSource.code.example.ts" onlyCode={ true } />

                <DocExample title="LazyDataSourceApi" path="./_examples/datasources/LazyDataSourceApi.code.example.ts" onlyCode={ true } />
                <EditableDocContent fileName="datasources-lazy-api-overview" />

                <DocExample title="Data" path="./_examples/datasources/LazyDatasourceData.example.tsx" />
                <DocExample title="Child count" path="./_examples/datasources/LazyDatasourceGetChildCount.example.tsx" />
                <DocExample title="Filter" path="./_examples/datasources/LazyDatasourceFilter.example.tsx" />
                <DocExample title="Flatten search results" path="./_examples/datasources/LazyDatasourceFlattenSearchResults.example.tsx" />
            </>
        );
    }
}

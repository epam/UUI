import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../common';

export class DataSourcesLazyDataSourceDoc extends BaseDocsBlock {
    title = 'LazyDataSource';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="dataSources-lazy-dataSource" />

                <DocExample title="useLazyDataSource" path="./_examples/dataSources/UseLazyDataSource.code.example.ts" onlyCode={ true } />
                <EditableDocContent title="LazyDataSourceProps" fileName="dataSources-lazy-dataSource-props-overview" />

                <EditableDocContent title="LazyDataSourceApi" fileName="dataSources-lazy-api-overview" />

                <DocExample title="Data" path="./_examples/dataSources/LazyDataSourceData.example.tsx" />
                <DocExample title="How to request flatten data lazily?" path="./_examples/dataSources/LazyDataSourceRequestingFlattenData.example.tsx" />
                <DocExample title="How to request tree-like data lazily?" path="./_examples/dataSources/LazyDataSourceRequestingTreeLikeData.example.tsx" />
                <DocExample title="Child count" path="./_examples/dataSources/LazyDataSourceGetChildCount.example.tsx" />
                <DocExample title="Filter" path="./_examples/dataSources/LazyDataSourceFilter.example.tsx" />
                <DocExample title="Flatten search results" path="./_examples/dataSources/LazyDataSourceFlattenSearchResults.example.tsx" />
                <DocExample title="Using cursor-based pagination" path="./_examples/dataSources/LazyDataSourceCursor.example.tsx" />
            </>
        );
    }
}

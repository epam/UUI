import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../common';

export class DataSourcesArrayDataSourceDoc extends BaseDocsBlock {
    title = 'ArrayDataSource';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="dataSources-Array-dataSource" />
                
                <DocExample title="useArrayDataSource" path="./_examples/dataSources/UseArrayDataSource.code.example.ts" onlyCode={ true } />
                <EditableDocContent title="ArrayDataSourceProps" fileName="dataSources-array-dataSource-props-overview" />

                <DocExample title="Data" path="./_examples/dataSources/ArrayDataSourceData.example.tsx" />
                <DocExample title="Search" path="./_examples/dataSources/ArrayDataSourceSearch.example.tsx" />
                <DocExample title="Filter" path="./_examples/dataSources/ArrayDataSourceFilter.example.tsx" />
                <DocExample title="Sorting" path="./_examples/dataSources/ArrayDataSourceSorting.example.tsx" />
            </>
        );
    }
}

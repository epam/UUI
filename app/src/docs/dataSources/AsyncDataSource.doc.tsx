import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../common';

export class DataSourcesAsyncDataSourceDoc extends BaseDocsBlock {
    title = 'AsyncDataSource';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="dataSources-Async-dataSource" />

                <DocExample title="useAsyncDataSource" path="./_examples/dataSources/UseAsyncDataSource.code.example.ts" onlyCode={ true } />
                <EditableDocContent fileName="dataSources-async-dataSource-props-overview" />

                <DocExample title="Data" path="./_examples/dataSources/AsyncDataSourceData.example.tsx" />
            </>
            
        );
    }
}

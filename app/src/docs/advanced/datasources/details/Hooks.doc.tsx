import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../../../common';

export class DatasourcesHooksDoc extends BaseDocsBlock {
    title = 'Hooks';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="datasources-hooks" />
                <DocExample title="useArrayDataSource" path="./_examples/datasources/UseArrayDataSource.code.example.ts" onlyCode={ true } />
                <DocExample title="useAsyncDataSource" path="./_examples/datasources/UseAsyncDataSource.code.example.ts" onlyCode={ true } />
                <DocExample title="useLazyDataSource" path="./_examples/datasources/UseLazyDataSource.code.example.ts" onlyCode={ true } />
                <DocExample title="useView" path="./_examples/datasources/UseView.code.example.ts" onlyCode={ true } />
            </>
        );
    }
}

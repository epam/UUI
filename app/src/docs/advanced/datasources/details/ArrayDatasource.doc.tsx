import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../../../common';

export class DatasourcesArrayDatasourceDoc extends BaseDocsBlock {
    title = 'ArrayDatasource';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="datasources-Array-datasource" />
                <DocExample title="Data" path="./_examples/datasources/ArrayDatasourceData.example.tsx" />
            </>
        );
    }
}

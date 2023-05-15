import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../../../common';

export class DatasourcesLazyDatasourceDoc extends BaseDocsBlock {
    title = 'LazyDatasource';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="datasources-lazy-datasource" />
                <DocExample title="Data" path="./_examples/datasources/LazyDatasourceData.example.tsx" />
            </>
        );
    }
}

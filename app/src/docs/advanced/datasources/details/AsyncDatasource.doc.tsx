import * as React from 'react';
import { BaseDocsBlock, EditableDocContent } from '../../../../common';

export class DatasourcesAsyncDatasourceDoc extends BaseDocsBlock {
    title = 'AsyncDatasource';

    renderContent() {
        return (
            <EditableDocContent fileName="datasources-Async-datasource" />
        );
    }
}
